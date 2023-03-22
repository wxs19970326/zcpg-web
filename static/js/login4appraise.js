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
    $('#loading').css('display', 'block');
    let phone = $('#phone-num').val();
    if (phone === "" || phone === undefined) {
        $('#loading').css('display', 'none');
        openModal('手机号不能为空')
    } else if (phone.length !== 11) {
        $('#loading').css('display', 'none');
        openModal('手机号不合法')
    } else {
        $.ajax({
            type: 'post',
            url: SERVICE_URL + '/company/get/validCode',
            data: $('#loginForm').serialize(),
            xhrFields: {withCredentials: true},
            success: function (vo) {
                $('#loading').css('display', 'none');
                if (vo.code === OK) {
                    timing();
                    openModal(vo.message)
                } else {
                    openModal(vo.message)
                }
            },
            error: function () {
                $('#loading').css('display', 'none');
                openModal(SERVER_ERROR)
            }
        })
    }
}

$('#valid-btn').click(function () {
    getCode()
});

function openModal(msg) {
    $('#tips-content').empty();
    $('#tips-content').append(msg);
    $('#exampleModal').modal('show')
}

$('#login-btn').click(function () {
    login()
});

function login() {
    $('#loading').css('display', 'block');
    let valid = $('#valid').val();
    if (valid === "" || valid === undefined) {
        $('#loading').css('display', 'none');
        openModal('验证码不能为空')
    } else if (valid.length !== 6) {
        $('#loading').css('display', 'none');
        openModal('验证码不合法')
    } else {
        $.ajax({
            type: 'post',
            url: SERVICE_URL + '/company/login',
            data: $('#loginForm').serialize(),
            xhrFields: {withCredentials: true},
            success: function (vo) {
                if (vo.code === OK || vo.code === RE_LOGIN) {
                    $('#loading').css('display', 'none');
                    location.href = 'companyAppraise.html'
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
    }
}