
$(function () {

    $("#frmCusInfo").validate({
        errorElement: 'span',
        errorClass: 'text-danger',

        ignore: [],
        rules: {
            'customer_name': {'required': true},
            'business_name': {'required': true},
            'business_address': {'required': true},
            'customer_email': {'required': true, email: true},
        },
        messages: {

        },
        submitHandler: function (form) {
            form.submit();
        },
        errorPlacement: function (error, element) {
            error.insertAfter(element);
        }
    });

});

$(document).ready(function () {
    $('.btnEnterAgent').click(function(){
        var checkAgentBtn2 = $(this).closest('form').find('input[name="agentBtn2"]').val();
        if(checkAgentBtn2 == 1){
            $('input[name="checkModal"]').val(checkAgentBtn2);
        }else{

            $('input[name="checkModal"]').val(0);
        }
    });
    $("#btncalculate").click(function (e) {
        e.preventDefault();
        $('#future_div').hide();
        $('#agentId').val('');

        var month_credit = $("#month_credit").val();
        var cash_discount = $("#cash_discount").val();
        var average_sale = $("#average_sale").val();
        var processing_fees = $("#processing_fees").val();

        if (cash_discount.length == 0) {
            alert("Please Enter Cash Discount percentage");
            return false;
        }

        if (average_sale.length == 0) {
            alert("Please Enter average sale amount");
            return false;
        }

        if (cash_discount < 3 || cash_discount > 4)
        {
            alert("Please enter discount percentage in range of 3% to 4%");
            return false;
        }
        $.ajax({
            type: "POST",
            url: $BASEURL + "CashDiscount/checkCalculate",
            data: {month_credit: month_credit, cash_discount: cash_discount, processing_fees: processing_fees},
            success: function (data) {
                var result = JSON.parse(data);
                if (result.future_data)
                {
                    console.log("this working")

                   if($("#cash_discount").attr('readonly') == "readonly"){
                        $('#per_year').html(result.future_data.year.toFixed(2));
                        $('#per_year_cal').html(result.future_data.year.toFixed(2));
                        $('#future_div').show();
                        $('#homeAgentBtn').hide();
                        $('.infoBtn').hide();
                   }else{
                       $('#per_year').html(result.future_data.year.toFixed(2));
                        $('#per_year_cal').html(result.future_data.year.toFixed(2));
                        $('.home_section').css('display','none');
                        $('#frmCusInfo').css('display','block');
                        $('.share_quote_section').css('display','block');
                   }
                } else {
                    alert("error");
                }
            },
            error: function (result) {
                alert('error');
            }
        });

    });

    $("#checkAgent").click(function (e) {
        e.preventDefault();
        var id = $("#agentId").val();
        var month_credit = $("#month_credit").val();
        var cash_discount = $("#cash_discount").val();
        var processing_fees = $("#processing_fees").val();

        $.ajax({
            type: "POST",
            url: $BASEURL + "CashDiscount/checkAgent",
            data: {agentId: id},
            beforeSend: function () {
                $("#checkAgent").html('wait..');
                $("#checkAgent").attr("disabled", true);
            },

            success: function (data) {
                var result = JSON.parse(data);
                if (result.agent_data)
                {
                    $('#exampleModal').modal('hide');

                    $('#agent_name').val(result.agent_data.full_name);
                    $('#agent_company_name').val(result.agent_data.company_name);
                    $('#agent_email').val(result.agent_data.email);
                    $('#agent_phone').val(result.agent_data.phone);
                    if($('input[name="checkModal"]').val() == 1){
                        $('#exampleModal3').modal('show');
                    }else{
                        $('#cash_discount').attr('readonly' , false);
                    }
                } else {
                    alert("Invalid Agent ID");
                    $('#exampleModal').modal('hide');
                }
                $("#checkAgent").html('Submit');
                $("#checkAgent").attr("disabled", false);
            },
            error: function (result) {
                 $("#checkAgent").html('Submit');
                $("#checkAgent").attr("disabled", false);
                alert('error');

            }
        });
    });

    $("#checkDiscountPer").click(function (e) {
        e.preventDefault();
        var desired_per = $("#desired_per").val();
        var month_credit = $("#month_credit").val();
        var processing_fees = $("#processing_fees").val();

        if (desired_per < 3 || desired_per > 4)
        {
            alert("Please enter discount percentage in range of 3% to 4%");
            return false;
        }

        $.ajax({
            type: "POST",
            url: $BASEURL + "CashDiscount/checkDiscountPer",
            data: {desired_per: desired_per, month_credit: month_credit, processing_fees: processing_fees},
            success: function (data) {
                var result = JSON.parse(data);
                if (result.future_data)
                {
                    $('#exampleModal3').modal('hide');
                    $('#cash_discount').val(desired_per);
                    $('#per_year').html(result.future_data.year.toFixed(2));
                    $('#per_year_cal').html(result.future_data.year.toFixed(2));
                    // $('#share_quo').show();
                    $("#autoScroll").animate({scrollTop: $("#autoScroll")[0].scrollHeight}, 1000);

                } else {
                    alert("Error");
                    $('#exampleModal3').modal('hide');
                }
            },
            error: function (result) {
                alert('error');
            }
        });
    });

    $("#sendQuote").click(function (e) {
        var to = $("#to").text();
        var cc = $("#cc").text();
        var customer_name = $("#customer_name_preview").text();
        var yearly_saving = $("#per_year").text();
        var agent_name = $("#agent_name_preview").text();
        var agent_email = $("#agent_email_preview").text();
        var agent_phone = $("#agent_phone_preview").text();
        var business_name = $("#business_name_preview").text();
        var business_address = $("#business_address_preview").text();

        var processing_volumne = $("#processing_volumne").text();
        var average_ticket = $("#average_ticket").text();
        var processing_fee = $("#processing_fee").text();

        e.preventDefault();
        ajaxindicatorstart('loading.....');
        $.ajax({
            type: "POST",
            url: $BASEURL + "CashDiscount/sendQuote",
            data: {to: to, cc: cc, customer_name: customer_name, yearly_saving: yearly_saving, agent_name: agent_name, agent_email: agent_email, agent_phone: agent_phone, business_name: business_name, business_address: business_address, processing_fee: processing_fee, average_ticket: average_ticket, processing_volumne: processing_volumne},
            success: function (data) {
                 ajaxindicatorstop();
                if (data == 1)
                {
                    $('#exampleModa2').modal('hide');
                    alert("The Cash Discount Program Savings Quote was successfully sent.");
                } else {
                    $('#exampleModa2').modal('hide');
                }
            },
            error: function (result) {
                alert('error');
            }
        });
    });

    $('#openPreview').click(function (e) {
        if ($('#frmCusInfo').valid()) {
            e.preventDefault();
            var customer_name = $("#customer_name").val();
            var business_name = $("#business_name").val();
            var business_address = $("#business_address").val();
            var customer_email = $("#customer_email").val();
            var yearly_saving = $("#per_year").text();
            var agent_name = $("#agent_name").val();
            var agent_company_name = $("#agent_company_name").val();
            var agent_email = $("#agent_email").val();
            var agent_phone = $("#agent_phone").val();

            var processing_volumne = $("#month_credit").val();
            var average_ticket = $("#average_sale").val();
            var processing_fee = $("#processing_fees").val();

            if (customer_name)
            {
                $('#exampleModal1').modal('hide');

                $('#to').html(customer_email);
                $('#cc').html(agent_email);
                $('#customer_name_preview').html(customer_name);
                $('#to_customer_name').html(customer_name);
                $('#customer_name__to_preview').html(customer_name);
                $('#yearly_saving').html(yearly_saving);
                $('#agent_name_preview').html(agent_name);
                $('#agent_company_name_preview').html(agent_company_name);
                $('#agent_email_preview').html(agent_email);
                $('#agent_phone_preview').html(agent_phone);
                $('#business_name_preview').html(business_name);
                $('#business_address_preview').html(business_address);

                $('#processing_volumne').html(processing_volumne);
                $('#average_ticket').html(average_ticket);
                $('#processing_fee').html(processing_fee);

                $('#agent_name_preview1').html(agent_name);


                $('#exampleModa2').modal('show');
            }
        }

    });
    $('#getFlyer').click(function (e) {
        //if ($('#frmCusInfo').valid()) {
         //   e.preventDefault();
            var agent_name = $("#agent_name").val();
             var agent_email = $("#agent_email").val();
             var agent_phone = $("#agent_phone").val();
             var contact_us_text = $(".contactUsText").val();
             var saving_text = $(".savingText").val();

        // if (customer_name)
        //     {
                $('.agent_name').val(agent_name);
                $('.agent_email').val(agent_email);
                $('.agent_phone').val(agent_phone);

                $("#contant_us").html(contact_us_text);
                $("#saving").html(saving_text);
                $('#Agent_Name').html(agent_name);
                $('#Agent_Email').html(agent_email);
                $('#Agent_Contact').html(agent_phone);

                $('.share_quote_section').css('display','none');
                $('.get_flyer_section').css('display','block');
        //     }
        // }
        $('#file-upload').change(function(e){
          for (var i = 0; i < e.originalEvent.srcElement.files.length; i++) {
            var file = e.originalEvent.srcElement.files[i];
             var reader = new FileReader();
            reader.onloadend = function() {
                 $('#logo').attr('src', reader.result);
            }
            reader.readAsDataURL(file);
          }
        });
        $(".agent_name").keyup(function(){
        $("#Agent_Name").html($(this).val());
        });
        $(".agent_email").keyup(function(){
        $("#Agent_Email").html($(this).val());
        });
        $(".agent_phone").keyup(function(){
        $("#Agent_Contact").html($(this).val());
        });
        $(".contactUsText").keyup(function(){
        $("#contant_us").html($(this).val());
        });
        $(".savingText").keyup(function(){
        $("#saving").html($(this).val());
        });
    });
    $("#sendMail").click(function (e) {
         var to = $(".agent_email").val();
         var agent_name = $(".agent_name").val();
         var agent_email = $(".agent_email").val();
         var agent_phone = $(".agent_phone").val();
         var contact_us_text = $(".contactUsText").val();
         var saving_text = $(".savingText").val();
         var logo = $('#logo').attr('src');
         var file = "";
        e.preventDefault();
        ajaxindicatorstart('loading.....');
        $.ajax({
            type: "POST",
            url: $BASEURL + "CashDiscount/sendFlyerMail",
            data: { to: to, agent_name: agent_name, agent_email: agent_email, agent_phone: agent_phone , contact_us_text:contact_us_text ,saving_text:saving_text, logo:logo },
            success: function (data) {
                ajaxindicatorstop();
                  alert("The Cash Discount Program Flyer was successfully sent.");
            },
            error: function (result) {
                alert('error');
            }
        });
    });
    $('#bussinessForm').bootstrapValidator({
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            customer_name: {
                validators: {
                    notEmpty: {
                        message: 'The customer_name is required'
                    }
                }
            },
            business_name: {
                validators: {
                    notEmpty: {
                        message: 'The business_name is required'
                    }
                }
            },
            business_address: {
                validators: {
                    notEmpty: {
                        message: 'The business_address is required'
                    }
                }
            },
            customer_email: {
                validators: {
                    notEmpty: {
                        message: 'The customer_email is required'
                    }
                }
            }
        }
    });



    $('#frmCusInfo').bootstrapValidator({
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            customer_name: {
                validators: {
                    notEmpty: {
                        message: 'The customer name is required'
                    }
                }
            },
            business_name: {
                validators: {
                    notEmpty: {
                        message: 'The business_name is required'
                    }
                }
            },
            business_address: {
                validators: {
                    notEmpty: {
                        message: 'The business_address is required'
                    }
                }
            },
            customer_email: {
                validators: {
                    notEmpty: {
                        message: 'The customer_email is required'
                    }
                }
            }
        }
    });

    $('#exampleModa2').on('shown.bs.modal', function () {
        $('#frmCusInfo').bootstrapValidator('resetForm', true);
    });
    $('body').on('click', '.download', function () {
        var agent_name = $(".agent_name").val();
         var agent_email = $(".agent_email").val();
         var agent_phone = $(".agent_phone").val();
         var contact_us_text = $(".contactUsText").val();
         var saving_text = $(".savingText").val();
        var logo = $('#logo').attr('src');
        $('#flyer_agent_name').val(agent_name);
        $('#flyer_agent_email').val(agent_email);
        $('#flyer_agent_phone').val(agent_phone);
        $('#flyer_contact_us_text').val(contact_us_text);
        $('#flyer_saving_text').val(saving_text);
        $('#flyer_logo').val(logo);
         $("#downloadPdf").submit();
    });
// $('.btnprintpreview').on('click', function (e) {
    $("body").on("click", ".btnprintpreview", function () {

        // e.preventDefault();
        var iso_bank = $("#iso_bank").val();
        var f_name = $("#f_name").val();
        var l_name = $("#l_name").val();
        var phone = $("#phone").val();
        var email = $("#email").val();
        var date_sign = $("#date_sign").val();

        var agent_code = $("#agent_code").val();
        var approved_by = $("#approved_by").val();
        var approval_date = $("#approval_date").val();
        var code_activated = $("#code_activated").val();
        var code_tested = $("#code_tested").val();

        $('#iso_bank').attr("value", iso_bank);
        $('#f_name').attr("value", f_name);
        $('#l_name').attr("value", l_name);
        $('#phone').attr("value", phone);
        $('#email').attr("value", email);
        $('#date_sign').attr("value", date_sign);

        $('#agent_code').attr("value", agent_code);
        $('#approved_by').attr("value", approved_by);
        $('#approval_date').attr("value", approval_date);
        $('#code_activated').attr("value", code_activated);
        $('#code_tested').attr("value", code_tested);


        printDiv();
        function printDiv() {
            // var w = window.open();
            var printContents = $(".print_view").html();
            var originalContents = document.body.innerHTML;
            document.body.innerHTML = printContents;
            //$(window.document.body).html(printContents);
            window.print();
            //$(w.document.body).html(originalContents);
            document.body.innerHTML = originalContents;

            // var w = window.open();
            // var html = $(".print_view").html();
            // $(w.document.body).html(html);
            // w.print();
        }
    });
    $('#frmCusInfo').css('display','none');
    // $("body").on("click","#shareQuoBtn",function(){
    $("body").on("click","#checkDiscountPer",function(){
        $('.home_section').css('display','none');
        $('#frmCusInfo').css('display','block');
        $('.share_quote_section').css('display','block');

    });
    $('.custom-iso-btn').click(function(){
        $('.home_section').css('display','none');
        $('#frmCusInfo').css('display','none');
        $('.share_quote_section').css('display','none');
        $('.get_flyer_section').css('display','none');
        $('.app_benifit_section').css('display','block');
        $('.custom-iso-btn').css('display','none');
        $('.custom-login-btn').css('display','none');
    });
    $('.join_us_btn').click(function(){
        //window.location.href = $BASEURL + "CashDiscount/MyBMRAgentRegistration";
        window.open($BASEURL + "CashDiscount/MyBMRAgentRegistration");
    });
});



function ValidateEmail(email) {
    var expr = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    return expr.test(email);
}

function incrementValue(e) {
    e.preventDefault();
    var fieldName = $(e.target).data('field');
    var parent = $(e.target).closest('div');
    var currentVal = parseInt(parent.find('input[name=' + fieldName + ']').val(), 10);

    if (!isNaN(currentVal)) {
        parent.find('input[name=' + fieldName + ']').val(currentVal + 1);
    } else {
        parent.find('input[name=' + fieldName + ']').val(0);
    }
}

function decrementValue(e) {
    e.preventDefault();
    var fieldName = $(e.target).data('field');
    var parent = $(e.target).closest('div');
    var currentVal = parseInt(parent.find('input[name=' + fieldName + ']').val(), 10);

    if (!isNaN(currentVal) && currentVal > 0) {
        parent.find('input[name=' + fieldName + ']').val(currentVal - 1);
    } else {
        parent.find('input[name=' + fieldName + ']').val(0);
    }
}

$('.input-group').on('click', '.button-plus', function (e) {
    incrementValue(e);
});

$('.input-group').on('click', '.button-minus', function (e) {
    decrementValue(e);
});

function ajaxindicatorstart(text) {
    if (jQuery('body').find('#resultLoading').attr('id') != 'resultLoading') {
        jQuery('body')
                .append(
                        '<div id="resultLoading" style="display:none"><div><img src="'+$BASEURL+'assets/cashDiscountProgram/img/ajax-loader.gif"><div>'
                                + text
                                + '</div></div><div class="bg"></div></div>');
    }

    jQuery('#resultLoading').css({
        'width' : '100%',
        'height' : '100%',
        'position' : 'fixed',
        'z-index' : '10000000',
        'top' : '0',
        'left' : '0',
        'right' : '0',
        'bottom' : '0',
        'margin' : 'auto'
    });

    jQuery('#resultLoading .bg').css({
        'background' : '#000000',
        'opacity' : '0.7',
        'width' : '100%',
        'height' : '100%',
        'position' : 'absolute',
        'top' : '0'
    });

    jQuery('#resultLoading>div:first').css({
        'width' : '250px',
        'height' : '75px',
        'text-align' : 'center',
        'position' : 'fixed',
        'top' : '0',
        'left' : '0',
        'right' : '0',
        'bottom' : '0',
        'margin' : 'auto',
        'font-size' : '16px',
        'z-index' : '10',
        'color' : '#ffffff'

    });

    jQuery('#resultLoading .bg').height('100%');
    jQuery('#resultLoading').fadeIn(300);
    jQuery('body').css('cursor', 'wait');
}

function ajaxindicatorstop() {
    jQuery('#resultLoading .bg').height('100%');
    jQuery('#resultLoading').fadeOut(300);
    jQuery('body').css('cursor', 'default');
}
 $(function () {
        $('[data-toggle="tooltip"]').tooltip();
 });