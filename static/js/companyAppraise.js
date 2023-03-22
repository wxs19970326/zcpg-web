$(function () {
    init(null);
});
$('#search-btn').click(function () {
    init(1);
});

function init(currPage) {
    loading("o(≧v≦)o数据加载中...");
    if (currPage !== null) {
        $('#currPageInput').val(currPage);
    }
    $.ajax({
        type: 'post',
        url: SERVICE_URL + '/asset/page',
        data: $('#dataForm').serialize(),
        xhrFields: {withCredentials: true},
        success: function (vo) {
            if (vo.code === OK) {
                renderData(vo.data);
                rederPage(vo.data);
                bindGo2Top();
            } else if (vo.code === NOT_LOGIN) {
                showRemindMoadl(vo.message);
            } else {
                showCommonMoadl(vo.message);
                loading("╮(￣﹏￣)╭数据加载失败了...");
            }
        },
        error: function () {
            bindGo2Top();
            loading("╮(￣﹏￣)╭数据加载失败了...");
            showCommonMoadl(SERVER_ERROR);
        }
    });
}

function selectList() {
    init(1);
}

function bindGo2Top() {
    // $("html,body").animate({scrollTop:"0px"},300);//500毫秒完成回到顶部动画
}

function loading(msg) {
    $('#data-tBody').empty();
    $('#data-tBody').append(`
        <tr>
            <td style="text-align: center" colspan="12">
                <h4>${msg}</h4>
            </td>
        </tr>
    `);
}

function showRemindMoadl(msg) {
    $('#remind-txt').empty();
    $('#remind-txt').append(`
    <h4>${msg}</h4>
    `);
    $('#remind-modal').modal('show');

}

function showCommonMoadl(msg) {
    $('#common-txt').empty();
    $('#common-txt').append(`
    <h4>${msg}</h4>
    `);
    $('#common-modal').modal('show');

}

function renderData(data) {
    let arr = data.list;
    $('#data-tBody').empty();
    if (arr.length > 0) {
        for (let i = 0; i < arr.length; i++) {
            let index = i + 1;
            // 录入时间
            let createTime = moment(arr[i].createTime).format('YYYY-MM-DD HH:mm:ss');
            let noAndName = arr[i].secPatentNo + '|' + arr[i].secPatentName;
            let html = "<a class='cursor-pointer' onclick='catSecondPatent(\"" + noAndName + "\")' href='javascript:void(0)'>查看</a>";
            let updateHtml = "<a class='cursor-pointer' onclick='catDetail(\"" + arr[i].id + "\")' href='javascript:void(0)'>修改</a>";
            let url = arr[i].assetReport === null ? null : SERVICE_URL + '/asset/download?id=' + arr[i].id + '&type=5';
            let downloadHtml = url === null ? "暂无" : "<a class='cursor-pointer' href='" + url + "'>下载</a>";
            $('#data-tBody').append(`
            <tr>
                <td>${index}</td>
                <td>${arr[i].titleHolder}</td>
                <td>${arr[i].creditCode}</td>
                <td>${arr[i].mainPatentNo}</td>
                <td>${arr[i].mainPatentName}</td>
                <td>${createTime}</td>
                <td>${html}</td>
                <td>${arr[i].assessor === null ? '暂无' : arr[i].assessor}</td>
                <td>${arr[i].preAssRes === null ? '暂无' : arr[i].preAssRes}</td>
                <td>${arr[i].finalAssRes === null ? '暂无' : arr[i].finalAssRes}</td>
                <td>${downloadHtml}</td>
                <td>
                    <!--<a onclick="catDetail(${arr[i].id})" href="javascript:void(0)" class="detail">详情</a>-->
                    <!--<a onclick="catDetail(${updateHtml})" href="javascript:void(0)">修改</a>-->
                    ${updateHtml}
                </td>
            </tr>
            `);
        }
    } else {
        loading('╮(￣﹏￣)╭暂无数据...')
    }
}

function rederPage(data) {
    if (data.list.length > 0) {
        $('#first-page').removeAttr('disabled');
        $('#last-page').removeAttr('disabled');
        $('#curr-page').text('共' + data.pages + '页, 第' + data.pageNum + '页');
        if (data.isFirstPage) {
            $('#pre-page').attr('disabled', 'disabled');
            $('#first-page').attr('disabled', 'disabled');
            $('#next-page').removeAttr('disabled');
            $('#last-page').removeAttr('disabled');
        } else if (data.isLastPage) {
            $('#pre-page').removeAttr('disabled');
            $('#first-page').removeAttr('disabled');
            $('#next-page').attr('disabled', 'disabled');
            $('#last-page').attr('disabled', 'disabled');
        } else {
            $('#pre-page').removeAttr('disabled');
            $('#first-page').removeAttr('disabled');
            $('#next-page').removeAttr('disabled');
            $('#last-page').removeAttr('disabled');
        }
        if (data.isFirstPage && data.isLastPage) {
            $('#next-page').attr('disabled', 'disabled');
            $('#last-page').attr('disabled', 'disabled');
        }
        $('#pre-page').attr('onclick', "turnPage(" + data.prePage + ")");
        $('#next-page').attr('onclick', "turnPage(" + data.nextPage + ")");
        $('#first-page').attr('onclick', "turnPage(" + data.firstPage + ")");
        $('#last-page').attr('onclick', "turnPage(" + data.lastPage + ")");
    } else {
        $('#pre-page').attr('disabled', 'disabled');
        $('#curr-page').attr('disabled', 'disabled');
        $('#next-page').attr('disabled', 'disabled');
        $('#first-page').attr('disabled', 'disabled');
        $('#last-page').attr('disabled', 'disabled');
    }
}

function turnPage(pageNum) {
    init(pageNum);
}

function catDetail(id) {
    $('#update-form').css('display', '');
    $('#report-modal').css('display', 'none');
    $.ajax({
        type: 'get',
        url: SERVICE_URL + '/asset/get/info/' + id,
        xhrFields: {
            withCredentials: true
        },
        success: function (vo) {
            if (vo.code === OK) {
                infoDisplay(vo.data);
            } else if (vo.code === NOT_LOGIN) {
                location.href = 'login4appraise.html'
            } else {
                showCommonMoadl(vo.message);
            }
        },
        error: function () {
            showCommonMoadl(SERVER_ERROR);
        }
    });
}

function infoDisplay(data) {
    $('#record-id').val(data.id);
    $('#titleHolder').val(data.titleHolder);
    $('#creditCode').val(data.creditCode);
    $('#mainPatentNo').val(data.mainPatentNo);
    $('#mainPatentName').val(data.mainPatentName);
    $('#patentSel').val(data.patentName);
    $('#validDateSel').val(data.validDate);
    $('#industrySel').val(data.industryName);
    $('#assetAimSel').val(data.assetAimName);
    $('#assRefTimeStr').val(formatDateTime(data.assRefTime));
    $('#preYearIncome').val(data.preYearIncome);
    $('#currYearIncome').val(data.currYearIncome);
    $('#contacts').val(data.contacts);
    $('#phoneNum').val(data.phoneNum);
    $('#preAssRes').val(data.preAssRes);
    $('#email').val(data.email);
    $('#preAssRes').val(data.preAssRes);
    $('#finalAssRes').val(data.finalAssRes);
    let noArr = data.secPatentNo.split(',');
    let nameArr = data.secPatentName.split(',');
    $('#second-patent-tr-content').css('display', 'none');
    $('#tab #second-patent-tr-content').empty();
    for (let i = 0; i < noArr.length; i++) {
        if (i === 0) {
            $('#sec-patent-no').val(noArr[i]);
            $('#sec-patent-name').val(nameArr[i]);
        } else {
            $('#second-patent-tr-content').append(`
            <tr>
                <td class="label-td">
                    <label></label>
                </td>
                <td class="input-td">
                    <div class="ui input">
                        <input name="secPatentNo" disabled type="text" value="${(noArr[i] === undefined || noArr[i] === '') ? '暂无' : noArr[i]}">
                    </div>
                </td>
                <td class="label-td">
                    <label></label>
                </td>
                <td class="input-td">
                    <div class="ui input">
                        <input name="secPatentName" disabled type="text" value="${(nameArr[i] === undefined || nameArr[i] === '') ? '暂无' : nameArr[i]}">
                    </div>
                </td>
            </tr>
            `);
        }
    }
    $('#yyzz').attr('href', SERVICE_URL + '/asset/download?id=' + data.id + '&type=1');
    $('#zlzs').attr('href', SERVICE_URL + '/asset/download?id=' + data.id + '&type=2');
    $('#ndbb').attr('href', SERVICE_URL + '/asset/download?id=' + data.id + '&type=3');
    if (data.entrustAuthor === null || data.entrustAuthor === '') {
        $('#strwqs').text('暂无文件')
        $('#strwqs').attr('href', 'javascript:void(0)');
    } else
        $('#strwqs').attr('href', SERVICE_URL + '/asset/download?id=' + data.id + '&type=4');
    $('#update-modal').modal('show');
}

$('#display-btn').click(function () {
    if ($('#second-patent-tr-content').css('display') === 'none') {
        $('#second-patent-tr-content').css('display', '');
        $('#display-btn').text("➖");
    } else {
        $('#second-patent-tr-content').css('display', 'none');
        $('#display-btn').text("➕");
    }
});

function formatDateTime(inputTime) {
    let date = new Date(inputTime);
    let y = date.getFullYear();
    let m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    let d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    let h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    let minute = date.getMinutes();
    let second = date.getSeconds();
    minute = minute < 10 ? ('0' + minute) : minute;
    second = second < 10 ? ('0' + second) : second;
    return y + '-' + m + '-' + d/* +' ' + h + ':' + minute + ':' + second*/;
}

function catSecondPatent(noAndName) {
    let no = noAndName.split('|')[0];
    let name = noAndName.split('|')[1];
    let noArr = no.split(',');
    let nameArr = name.split(',');
    $('#second-body').empty();
    console.log(no);
    if (no === '') {
        $('#second-body').append(`
            <tr>
                <td style="text-align: center" colSpan="3">
                    <h4>暂无附属专利</h4>
                </td>
            </tr>
        `);
    } else {
        for (let i = 0; i < noArr.length; i++) {
            let index = i + 1;
            let noArrI = '';
            let nameArrI = '';
            if (noArr[i] === undefined || noArr[i] === '')
                noArrI = '暂无';
            else
                noArrI = noArr[i];
            if (nameArr[i] === undefined || nameArr[i] === '')
                nameArrI = '暂无';
            else
                nameArrI = noArr[i];
            $('#second-body').append(`
            <tr>
                <td>${index}</td>
                <td>${noArrI}</td>
                <td>${nameArrI}</td>
            </tr>
        `);
        }
    }
    $('#second-patent').modal('show');
}

$('#remind-modal').modal({
    onApprove: function () {
        location.href = 'login4appraise.html';
        ;
    },
});

$('#btn-next').click(function () {
    let finalAsset = $('#finalAssRes').val();
    if (finalAsset === null || finalAsset === '') {
        $('#finalAssRes').css('border', '1px solid red');
        return;
    } else {
        $('#finalAssRes').css('border', '');
    }
    let param = {
        id: $('#record-id').val(),
        creditCode: $('#creditCode').val(),
        finalAssRes: finalAsset
    };
    $.ajax({
        type: 'post',
        url: SERVICE_URL + '/asset/final/result',
        data: param,
        xhrFields: {
            withCredentials: true
        },
        success: function (vo) {
            if (vo.code === OK) {
                $('#report-modal1').modal('show');
                $('#report-content').html(vo.data);
            } else {
                showCommonMoadl(vo.message);
            }
        },
        error: function () {
            showCommonMoadl(SERVER_ERROR);
        }
    });
});

function inputNumber(e) {
    e.value = e.value.replace(/[^0-9]/g, '')  // 不可输入数字和小数点以外的
}

$('#back-btn').click(function () {
    $('#update-modal').modal('show');
});

$('#send-mail').click(function () {
    $('#report-modal1').modal('hide');
    $('#mine-loading').css('display', 'block');
    let param = {
        id: $('#record-id').val(),
        creditCode: $('#creditCode').val(),
        finalAssRes: $('#finalAssRes').val()
    };
    $.ajax({
        type: 'post',
        url: SERVICE_URL + '/asset/send/email',
        data: param,
        xhrFields: {
            withCredentials: true
        },
        success: function (vo) {
            $('#mine-loading').css('display', 'none');
            if (vo.code = OK) {
                init(null);
            }
            showCommonMoadl(vo.message);
        },
        error: function () {
            $('#mine-loading').css('display', 'none');
            showCommonMoadl(SERVER_ERROR);
        }
    });
});