/*
* App cordova 
* autor: Felipe Pereira
*/

const DataPoints = [];
const url = 'http://localhost:3000/products';
const urlPost = 'http://10.40.1.122:3000/novo-pedido';

$(document).ready(function () {
    var count = 1;
    $.ajax({
        url: url,
        success: function (result) {
            // Incrementa o array com o data retordo pelo serviço consumido
            for (let _i = 0; _i < result.length; _i++) {
                DataPoints.push({
                    "title": result[_i].title,
                    "category": result[_i].category,
                    "preco": result[_i].price
                })
            }
            //Monta a lista dos produtos
            for (let _j = 0; _j < DataPoints.length; _j++) {
                $('#myUL').append(
                    '<li class="collection-item">' +
                    '<span class="title"><b> 0' + (count++) + ' Nome: ' + ' ' + DataPoints[_j].title + '</b></span>' +
                    '<p>Descrição: ' + DataPoints[_j].category + '<p>' +
                    '<p>Preço: </b>R$ ' + DataPoints[_j].preco + ',00</p>' +
                    "</li>");
            }
            console.log(DataPoints);
        },
        error: function (request, error) {
            alert('Request timeout');
        }
    });
});

$('.collection')
    .on('click', '.collection-item', function () {
        var newProduct = this.firstChild.textContent;
        Materialize.toast(newProduct + ' adicionado', 900);

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

// Modal Trigger
$(document).ready(function () {
    $('.modal').modal();
});

//Confirmação do pedido
$('#confirmar').on('click', function () {
    var text = '';

    $('.badge').parent().each(function () {
        text += this.firstChild.textContent + ': ';
        text += this.lastChild.textContent + ', ';
    });

    $('#resumo').empty().text(text);
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

//Declaração do plugin qrcode
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

//Finalização do pedido (Envia os dados para o servidor)
$('.acao-finalizar').on('click', function () {
    $.ajax({
        url: urlPost,
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

