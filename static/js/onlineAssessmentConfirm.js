let time = 300;
let t;

function timing() {
    t = setInterval(function () {
        countdown()
    }, 1000);
    countdown()
}

function countdown() {
    if (time === 0) {
        time = 300;
        clearInterval(t);
        $('#valid-btn').removeAttr("disabled");
        $('#valid-btn').text("重发验证码")
    } else {
        $('#valid-btn').attr('disabled', "true");
        $('#valid-btn').text(time + "s后可重发");
        time--
    }
}

function getCode() {
    $('#loading2').css('display', 'block');
    let phone = $('#phone-num').val();
    if (phone === "" || phone === undefined) {
        $('#loading2').css('display', 'none');
        openModalC('手机号不能为空')
    } else if (phone.length !== 11) {
        $('#loading2').css('display', 'none');
        openModalC('手机号长度不合法')
    } else {
        $.ajax({
            type: 'post',
            url: SERVICE_URL + '/online/get/valid/code/' + phone,
            xhrFields: {withCredentials: true},
            success: function (vo) {
                if (vo.code === OK) {
                    $('#loading2').css('display', 'none');
                    timing();
                    openModalC(vo.message)
                } else {
                    $('#loading2').css('display', 'none');
                    openModalC(vo.message)
                }
            },
            error: function () {
                $('#loading2').css('display', 'none');
                openModalC(SERVER_ERROR)
            }
        })
    }
}

$('#valid-btn').click(function () {
    getCode()
});

function openModalC(msg) {
    $('#tips-content-cm').empty();
    $('#tips-content-cm').append(msg);
    $('#exampleModalConfirm').modal('show')
}

function openSuccessModal(msg) {
    $('#tips-content-success').empty();
    $('#tips-content-success').append(msg);
    $('#successModal').modal('show')
}

function selectService() {
    window.open('privacyAndService.html')
}

$('#confirm-btn').click(function () {
    $('#loading2').css('display', 'block');
    if ($('#contacts').val() === null || $('#contacts').val() === '') {
        $('#loading2').css('display', 'none');
        openModalC('姓名不能为空');
        return
    }
    if ($('#contacts').val().length < 2) {
        $('#loading2').css('display', 'none');
        openModalC('姓名至少为两位');
        return
    }
    if ($('#phone-num').val() === null || $('#phone-num').val() === '') {
        $('#loading2').css('display', 'none');
        openModalC('手机号不能为空');
        return
    }
    if ($('#phone-num').val().length !== 11) {
        $('#loading2').css('display', 'none');
        openModalC('手机号不合法');
        return
    }
    if ($('#valid').val() === null || $('#valid').val() === '') {
        $('#loading2').css('display', 'none');
        openModalC('验证码不能为空');
        return
    }
    if ($('#valid').val().length !== 6 || !(/^[1-9][0-9]*$/.test($('#valid').val()))) {
        $('#loading2').css('display', 'none');
        openModalC('验证码不合法');
        return
    }
    if ($('#email').val() === null || $('#email').val() === '') {
        $('#loading2').css('display', 'none');
        openModalC('邮箱不能为空');
        return
    }
    if ($('#email').val().indexOf('@') === -1) {
        $('#loading2').css('display', 'none');
        openModalC('邮箱不合法');
        return
    }
    if (!(document.getElementById("select-radio").checked)) {
        $('#loading2').css('display', 'none');
        openModalC('请查看并勾选《用户服务协议》');
        return
    }
    var patentNos = '';
    var mainPatentNo = $('#mainPatentNoSelect').val();
    for (var i = 0; i < mainPatentNo.length; i++) {
        if (i === mainPatentNo.length - 1) {
            patentNos = patentNos + mainPatentNo[i];
        } else {
            patentNos = patentNos + mainPatentNo[i] + ",";
        }
    }
    $('#mainPatentNo').val(patentNos);
    $('#submit-form').submit()
});
$('#submit-form').ajaxForm(function (data) {
    if (data.code === OK) {
        $('#loading2').css('display', 'none');
        openSuccessModal(data.message)
    } else if (data.code !== undefined && data.code != null && data.code !== '') {
        $('#loading2').css('display', 'none');
        openModalC(data.message)
    } else {
        $('#loading2').css('display', 'none');
        openModalC(SERVER_ERROR)
    }
});
$('#back-btn').click(function () {
    convertPage('SUBMIT');
    reset()
});

function reset() {
    $('#contacts').val('');
    $('#phone-num').val('');
    $('#email').val('');
    document.getElementById("select-radio").checked = false
}

$('#success-btn').click(function () {
    location.reload()
});