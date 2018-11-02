var DataPoints = [];
var DrinkList = [];
var count = 1;
var count1 = 1;

$(document).ready(function () {
    $.ajax({
        url: "http://localhost:3000/products",
        success: function (result) {
            //var data = JSON.parse(result)
            for (let _i = 0; _i < result.length; _i++) {
                DataPoints.push({
                    "title": result[_i].title,
                    "category": result[_i].category,
                    "preco": result[_i].price
                })
            }

            for (let _i = 0; _i < DataPoints.length; _i++) {

                $('#myUL').append(
                    '<li class="collection-item">' +
                    '<span class="title"><b> 0' + (count++) + ' Nome: ' + ' ' + DataPoints[_i].title + '</b></span>' +
                    '<p>Descrição: ' + DataPoints[_i].category + '<p>' +
                    '<p>Preço: </b>R$ ' + DataPoints[_i].preco + ',00</p>' +
                    "</li>");
            }
            console.log(DataPoints);
        },
        error: function (request, error) {
            alert('Timeout request food list');
        }

    });

});


$('.collection')
    .on('click', '.collection-item', function () {
        var nomeProduto = this.firstChild.textContent;
        Materialize.toast(nomeProduto + ' adicionado', 900);

        var $badge = $('.badge', this);
        if ($badge.length === 0) {
            $badge = $('<span class="badge brown-text">0</span>').appendTo(this);
        }

        $badge.text(parseInt($badge.text()) + 1);
    })
    .on('click', '.badge', function () {
        $(this).remove();
        return false;
    });

$(document).ready(function () {
    // the "href" attribute of the modal trigger must specify the modal ID that wants to be triggered
    $('.modal').modal();
});


$('#confirmar').on('click', function () {
    var texto = "";

    $('.badge').parent().each(function () {
        texto += this.firstChild.textContent + ': ';
        texto += this.lastChild.textContent + ', ';
    });

    $('#resumo').empty().text(texto);
});

$('.acao-limpar').on('click', function () {
    $('#numero-mesa').val('');
    $('#observacao').val('');
    $('#hamburguer').val('');
    $('#hamburguer-descricao').val('');
    $('#drink').val('');
    $('#drink-descricao').val('');
    $('.badge').remove();
});

$('.scan-qrcode').click(function () {
    cordova.plugins.barcodeScanner.scan(function (resultado) {
        if (resultado.text) {
            Materialize.toast('Mesa ' + resultado.text, 2000);
            $('#numero-mesa').val(resultado.text);
        }
    },
        function (erro) {
            Materialize.toast('Erro' + erro, 2000, 'red-text');
        });
});

$('.acao-finalizar').on('click', function () {
    $.ajax({
        url: 'http://10.40.1.122:3000/novo-pedido',
        data: {
            mesa: $('#numero-mesa').val(),
            pedido: $('#resumo').text(),
            observacao: $('#observacao').val()
        },
        error: function (erro) {
            Materialize.toast(erro.responseText, 3000, 'red-text');
        },
        success: function (dados) {
            Materialize.toast(dados, 2000);
            navigator.vibrate(500);

            $('#numero-mesa').val('');
            $('.badge').remove();
        }
    });
});

$('.tap-target').tapTarget('open');
$('.tap-target').tapTarget('close');

