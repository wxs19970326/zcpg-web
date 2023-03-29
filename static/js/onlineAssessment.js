$(function () {
    initFormUrl();
    $('#mainPatentNoSelect').selectpicker({
        actionsBox: true,
        dropdownAlignRight: 'auto',
        width: 410
    });
    initSelect()
    init();
});

function init() {
    $('#assRefTimeStr').attr('placeholder', '格式：' + formatDateTime())
    $('#creditCode').blur(function () {
        findPatentList();
    });
    // $('#mainPatentNoSelect').change(function () {
    //     findPatentDetail();
    // });
    $('#findPatentListBtn').click(function () {
        openPatentListModal();
    });
    $('#closePatentListModal').click(function () {
        closePatentListModal();
    });
    $('#patentListModal').on('hide.bs.modal', function () {
        $(".modal-backdrop").remove();
    });
}

function initFormUrl() {
    $('#submit-form').attr('action', SERVICE_URL + '/online/submit');
    console.log(111)
    $('#checkedIndustry').click(function () {
        openIndustryTree();
    });
    $('#select-industry-confirm').click(function () {
        confirmIndustryId();
    });
}

function initSelect() {
    $.ajax({
        type: 'post',
        url: SERVICE_URL + '/online/init/data',
        xhrFields: {withCredentials: true},
        success: function (vo) {
            if (vo.code === OK) {
                // 评估对象下拉
                // let industryTypes = vo.data.industryTypes;
                // let patentTypes = vo.data.patentTypes;
                var assetAims = vo.data.assetAim;
                var evalObj = vo.data.evalObj;
                // for (let item of patentTypes) {
                //     $('#patentSel').append(`<option value="${item.patentId}"onclick="initDate()">${item.patentName}</option>`)
                // }
                // for (let item of industryTypes) {
                //     $('#industrySel').append(`<option value="${item.industryId}">${item.industryName}</option>`)
                // }
                for (var item of assetAims) {
                    $('#assetAimSel').append(`<option value="${item.dictValue}">${item.dictLabel}</option>`);
                }

                for (var item of evalObj) {
                    $('#assetObjId').append(`<option value="${item.dictValue}">${item.dictLabel}</option>`);
                }

                $('#phone-hover').text(vo.data.phoneNum);
                $('#footer-line').text(vo.data.copyright);
                initServiceStatement(vo.data.serviceStatement);
            } else {
                openModal(vo.message)
            }
        },
        error: function () {
            openModal(SERVER_ERROR)
        }
    })
}

function findPatentList() {
    $('#mainPatentNoSelect').empty();
    var creditCode = $('#creditCode').val();
    if (creditCode == null || creditCode === '' || creditCode.length !== 18) {
        // openModal(UN_FIND_CREDIT_CODE)
        return;
    }
    $.ajax({
        type: 'post',
        url: SERVICE_URL + '/online/get/patentList/' + creditCode,
        xhrFields: {withCredentials: true},
        success: function (vo) {
            if (vo.code === OK) {
                var patentItemList = vo.data;
                console.log(patentItemList)
                for (var item of patentItemList) {
                    $('#mainPatentNoSelect').append(`<option value="${item.patentNum}">${item.patentName}</option>`);
                }
                $('#mainPatentNoSelect').selectpicker('refresh');
            } else {
                openModal(vo.message)
            }
        },
        error: function () {
            openModal(SERVER_ERROR)
        }
    })
}

function findPatentDetail() {
    $('#patentListBody').empty();
    console.log($('#mainPatentNoSelect').val())
    var mainPatentNoSelect = $('#mainPatentNoSelect').val();
    if (mainPatentNoSelect == null || mainPatentNoSelect === '' || mainPatentNoSelect.length === 0) {
        openModal(UN_FIND_MAIN_PATENT_NO)
        // $('#mainPatentName').val(null)
        // $('#patentId').val(null)
        return;
    }
    var creditCode = $('#creditCode').val();
    var patentNos = '';
    for (var i = 0; i < mainPatentNoSelect.length; i++) {
        if (i === mainPatentNoSelect.length - 1) {
            patentNos = patentNos + mainPatentNoSelect[i];
        } else {
            patentNos = patentNos + mainPatentNoSelect[i] + ",";
        }
    }
    console.log(patentNos)
    $.ajax({
        type: 'post',
        url: SERVICE_URL + '/online/get/patentDetail/',
        data: {'patentNos': patentNos, 'creditCode': creditCode},
        xhrFields: {withCredentials: true},
        success: function (vo) {
            if (vo.code === OK) {
                var patentDetail = vo.data;
                console.log(patentDetail)
                if (patentDetail != null) {
                    for (var i = 0; i < patentDetail.length; i++) {
                        var item = patentDetail[i];
                        $('#patentListBody').append(`
                            <tr>
                                <th scope="row">${i + 1}</th>
                                <td>${item.applicationTime == null || item.applicationTime === '' ? '-' : item.applicationTime}</td>
                                <td>${item.patentName == null || item.patentName === '' ? '-' : item.patentName}</td>
                                <td>${item.patentType == null || item.patentType === '' ? '-' : item.patentType}</td>
                                <td><a href="javascript:void(0)">${item.patentStatus == null || item.patentStatus === '' ? '-' : item.patentStatus}</a></td>
                                <td>${item.patentNum == null || item.patentNum === '' ? '-' : item.patentNum}</td>
                                <td>${item.pubNumber == null || item.pubNumber === '' ? '-' : item.pubNumber}</td>
                                <td>${item.pubDate == null || item.pubDate === '' ? '-' : item.pubDate}</td>
                            </tr>
                        `);
                    }
                    $('#patentListModal').modal('show')
                }
            } else {
                openModal(vo.message)
            }
        },
        error: function () {
            openModal(SERVER_ERROR)
        }
    })
}

function initServiceStatement(serviceStatement) {
    $('#service-statement').empty();
    $('#service-statement').append("<p><span>使用本站点前，请仔细阅读下列条款：</span></p>\n" +
        "        <p><span>“鹏之翼”线上评估是为用户提供线上专利价值评估的网络平台。</span></p>");
    for (var item of serviceStatement) {
        $('#service-statement').append(`<p><span>${item.remark}</span></p>`);
    }
    $('#service-statement').append("<p><span>您浏览和使用鹏之翼即视为您接受以上条款。鹏之翼在法律许可范围内有权对本声明进行解释和修改，并将以网站信息更新的方式另行通知。</span></p>\n" +
        "                <p><span><br></span></p>");
}

$('#add-input').click(function () {
    if ($('#sec-patent-name').val() === '' || $('#sec-patent-no').val() === '') {
        openModal(INPUT_IS_NULL)
    } else {
        let inputs = $("tr[class='addInputMore']");
        var size = 0;
        if (inputs != null && inputs !== undefined) {
            size = inputs.length
        }
        var temp = size + 1;
        $('#tab #add-content').append("<tr class=\"addInputMore\" id='" + temp + "'>\n<td class=\"label-td\">\n<label></label>\n</td>\n<td class=\"input-td\">\n<input type=\"text\" name='secPatentNo' oninput=\"numAndABC(this)\"/>\n</td>\n<td class=\"label-td\">\n<label></label>\n</td>\n<td class=\"input-td\">\n<input type=\"text\" name='secPatentName'/>\n</td>\n<td style=\"width: 2%;cursor: pointer\" onclick=\"dec(" + temp + ")\">➖</td>\n</tr>")
    }
});

function dec(temp) {
    $('#' + temp).remove()
}

function openModal(msg) {
    $('#tips-content').empty();
    $('#tips-content').append(msg);
    $('#exampleModal').modal('show')
}

function openPatentListModal() {
    var mainPatentNoSelect = $('#mainPatentNoSelect').val();
    if (mainPatentNoSelect == null || mainPatentNoSelect === '' || mainPatentNoSelect.length === 0) {
        openModal(UN_FIND_MAIN_PATENT_NO);
    } else {
        findPatentDetail();
    }
}

function closePatentListModal() {
    $(".modal-backdrop").remove();
}

function uploadLicense() {
    $('#license').modal('show')
}

function uploadCertificate() {
    $('#certificate').modal('show')
}

function uploadExcel() {
    $('#excel').modal('show')
}

function uploadEntrustAuthor() {
    $('#entrustAuthor').modal('show')
}

function bindSubmit() {
    $("#submit-form").submit(function () {
        checkForm()
    })
}

$('#btn-next').click(function () {
    $('#loading').css('display', 'block');
    if (checkForm()) {
        $.ajax({
            type: 'post',
            url: SERVICE_URL + '/online/check/title/holder/' + $('#titleHolder').val(),
            xhrFields: {withCredentials: true},
            success: function (vo) {
                if (vo.code === OK) {
                    convertPage('CONFIRM')
                } else {
                    $('#loading').css('display', 'none');
                    openModal(vo.message)
                }
            },
            error: function () {
                $('#loading').css('display', 'none');
                openModal(SERVER_ERROR)
            }
        })
    } else {
        $('#loading').css('display', 'none')
    }
});

function convertPage(param) {
    if (param === 'SUBMIT') {
        $('#confirm').css('display', 'none');
        $('#submit').css('display', 'block')
    } else if (param === 'CONFIRM') {
        $('#confirm').css('display', 'block');
        $('#submit').css('display', 'none')
    }
    $('#loading').css('display', 'none')
}

function checkForm() {
    let titleHolder = $('#titleHolder').val();
    let assignor = $('#assignor').val();
    let creditCode = $('#creditCode').val();
    let mainPatentNoSelect = $('#mainPatentNoSelect').val();
    let assetObjId = $('#assetObjId').val();
    let validDate = $('#validDate').val();
    let industrySel = $('#industrySel').val();
    let assetAimSel = $('#assetAimSel').val();
    let assRefTimeStr = $('#assRefTimeStr').val();
    let preYearIncome = $('#preYearIncome').val();
    let currYearIncome = $('#currYearIncome').val();
    if (assignor == null || assignor === '') {
        res(ASSIGNOR_NULL);
        return false
    } else if (assetAimSel === null || assetAimSel === '') {
        res(ASSET_AIM_SEL_NULL);
        return false
    } else if (titleHolder === null || titleHolder === '') {
        res(TITLE_HOLDER_NULL);
        return false
    } else if (creditCode === null || creditCode === '') {
        res(CREDIT_CODE_NULL);
        return false
    } else if (creditCode.length !== 18) {
        res(CREDIT_CODE_LENGTH_ERROR);
        return false
    } else if (assetObjId == null || assetObjId === '') {
        res('请选择评估对象');
        return false
    } else if (mainPatentNoSelect == null || mainPatentNoSelect === '' || mainPatentNoSelect.length === 0) {
        res(MAIN_PATENT_NAME_NULL);
        return false
    } else if (validDate == null || validDate === '') {
        res(VALID_DATE_SEL_NULL);
        return false;
    }
    if (industrySel === null || industrySel === '') {
        res(INDUSTRY_SEL_NULL);
        return false
    } else if (assRefTimeStr === null || assRefTimeStr === '') {
        res(ASSREF_TIME_STR_NULL);
        return false
    } else if (!validTime(assRefTimeStr)) {
        res(ASSREF_TIME_STR_NO_VALID);
        return false
    } else if (!compareTime(assRefTimeStr)) {
        res(ASSREF_TIME_STR_GT_CURR);
        return false
    } else if (preYearIncome === null || preYearIncome === '') {
        res(PRE_YEAR_INCOME_NULL);
        return false
    } else if (currYearIncome === null || currYearIncome === '') {
        res(CURR_YEAR_INCOME_NULL);
        return false
    }
    let lic = document.getElementsByName("licenseFile")[0].value;
    let cert = document.getElementsByName("certificateFile")[0].value;
    let exce = document.getElementsByName("excelFile")[0].value;
    let entr = document.getElementsByName("entrustAuthorFile")[0].value;
    if (lic === "" || lic === null) {
        openModal('营业执照文件必传');
        $('#loading').css('display', 'none');
        return false
    }
    if (cert === "" || cert === null) {
        openModal('专利证书文件必传');
        $('#loading').css('display', 'none');
        return false
    }
    if (exce === "" || exce === null) {
        openModal('年度报表文件必传');
        $('#loading').css('display', 'none');
        return false
    }
    return true
}

function showFileList(type) {
    if (type === 1) {
        let lic = document.getElementsByName("licenseFile")[0].files;
        $('#licenseFileList').empty();
        for (let i = 0; i < lic.length; i++) {
            $('#licenseFileList').append(`<span style="display: block;margin: 5px 0;padding: 5px 5px;word-wrap:break-word;background-color:#EAF1F9;font-size: 13px;font-family:Sans-serif">${lic[i].name}<span/>`)
        }
        if (lic.length !== 0) $('#licenseCount').text(lic.length); else $('#licenseCount').text('0')
    } else if (type === 2) {
        let lic = document.getElementsByName("certificateFile")[0].files;
        $('#certificateFileList').empty();
        for (let i = 0; i < lic.length; i++) {
            $('#certificateFileList').append(`<span style="display: block;margin: 5px 0;padding: 5px 5px;word-wrap:break-word;background-color:#EAF1F9;font-size: 13px;font-family:Sans-serif">${lic[i].name}<span/>`)
        }
        if (lic.length !== 0) $('#certificateCount').text(lic.length); else $('#certificateCount').text('0')
    } else if (type === 3) {
        let lic = document.getElementsByName("excelFile")[0].files;
        $('#excelFileList').empty();
        for (let i = 0; i < lic.length; i++) {
            $('#excelFileList').append(`<span style="display: block;margin: 5px 0;padding: 5px 5px;word-wrap:break-word;background-color:#EAF1F9;font-size: 13px;font-family:Sans-serif">${lic[i].name}<span/>`)
        }
        if (lic.length !== 0) $('#excelCount').text(lic.length); else $('#excelCount').text('0')
    } else if (type === 4) {
        let lic = document.getElementsByName("entrustAuthorFile")[0].files;
        $('#entrustAuthorFileList').empty();
        for (let i = 0; i < lic.length; i++) {
            $('#entrustAuthorFileList').append(`<span style="display: block;margin: 5px 0;padding: 5px 5px;word-wrap:break-word;background-color:#EAF1F9;font-size: 13px;font-family:Sans-serif">${lic[i].name}<span/>`)
        }
        if (lic.length !== 0) $('#entrustAuthorCount').text(lic.length); else $('#entrustAuthorCount').text('0')
    }
}

function res(msg) {
    openModal(msg);
    $('#loading').css('display', 'none')
}

function validTime(timeStr) {
    return /^((([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})-(((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)-(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8]))))|((([0-9]{2})(0[48]|[2468][048]|[13579][26])|((0[48]|[2468][048]|[3579][26])00))-02-29))$/.test(timeStr)
}

function compareTime(timeStr) {
    timeStr.replace('-', '/');
    let time = new Date(timeStr);
    return time <= new Date()
}

// $('#validDateSel').click(function () {
//     if ($('#patentSel').val() === '' || $('#patentSel').val() === '' === null) {
//         openModal('请先选择“专利类型”')
//     }
// });
// $('#patentSel').change(function () {
//     let name = $(this).find('option:selected').text();
//     if (name === INVETN_PATENT) {
//         initDate(20)
//     } else if (name === UTILITY_MODEL || name === OUTTER_DEGISER) {
//         initDate(10)
//     } else if (name === SELECT_OPTION) {
//         initDate(0)
//     }
// });

function initDate(years) {
    if (years !== undefined) {
        $('#validDateSel').empty();
        $('#validDateSel').append('<option value="" selected>下拉选择</option>');
        for (let i = 1; i <= years; i++) {
            let param = i + '年';
            $('#validDateSel').append(`<option value="${i}">${param}</option>`)
        }
    }
}

$('#phone-img').mouseover(function () {
    $('#phone-hover').fadeIn(500);
});
$('#phone-img').mouseout(function () {
    // $('#phone-hover').css('display', 'none')
    $('#phone-hover').fadeOut(500);
});
$('#wechat-img').mouseover(function () {
    $('#wechat-hover').fadeIn(500);
});
$('#wechat-img').mouseout(function () {
    $('#wechat-hover').fadeOut(500);
});

function inputNumber(e) {
    e.value = e.value.replace(/[^0-9.]/g, '');
    e.value = e.value.toString().match(/^\d+(?:\.\d{0,2})?/)
}

function inputNumberD(e) {
    e.value = e.value.replace(/[^0-9]/g, '');
}

function numberValid(e) {
    e.value = e.value.replace(/[^\d]/g, ' ')
}

function numAndABC(e) {
    e.value = e.value.replace(/[\W]/g, '')
}

function formatDateTime() {
    var date = new Date();
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    return y + '-' + m + '-' + d;
}

function openIndustryTree() {
    $('#industryTreeModal').modal('show');
}

function confirmIndustryId() {
    $('#industryTreeModal').modal('hide');
}