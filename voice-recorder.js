document.addEventListener('DOMContentLoaded', function () {
    //o código só executa após a página ser completamente carregada.

    const textBox = document.querySelector('textarea'); //Seleciona a caixa de texto onde o áudio será inserido

    if(textBox){ //verifica se a caixa de texto foi encontrada na página;
        //cria o botão de gravação
        const recordButton = document.createElement('button');
        recordButton.textContent = 'Gravar Áudio'; //texto do botão
        recordButton.style.marginLeft = '10px'; //Adiciona um espaçõ entre o botãao e a caixa de texto
        textBox.parentNode.insertBefore(recordButton, textBox.nextSibling);
        //Insere o botão logo após a caixa de texto.
        
        let mediaRecorder; //variável que armazenará o gravador de áudio.
        let audioChunks = []; //lista que armazenará os "pedaços" do áudio gravado.

        //Adiciona um evento de clique ao botão de gravação.
        recordButton.addEventListener('click', function () {
            if(!mediaRecorder || mediaRecorder.state === 'inactive'){
                //Se o gravador não foi iniciado ou está inativo, inicia a gravação.

                navigator.mediaDevices.getUserMedia({ audio : true}) //solicita acesso ao microfone do usuário
                    .then(function (stream) {//Se o usuário conceder permissão ... 
                        mediaRecorder = new MediaRecorder(stream); //Cria o gravador de áudio.
                        mediaRecorder.start(); //Inicia a gravação
                        recordButton.textContent = 'Parar Gravação';//Muda o texto do botão para indicar que a gravação está em andamento

                        audioChunks = []; //reseta a lista de "pedaços de áudio"
                        mediaRecorder.ondataavailable = function (event) {
                            audioChunks.push(event.data)
                            //a cada pedaço de áudio gravado, ele é armazenado na lista.
                        };

                        mediaRecorder.onstop = function () {
                            //Quando a gravação for parada, cria um "Blob" de áudio.
                            const audioBlob = new Blob(audioChunks, { type: 'audio/ogg; codecs=opus'});
                            const audioUrl = URL.createObjectURL(audioBlob);
                            //Cria uma URL temporária para o arquico de áudio.

                            const audioFile = new File([audioBlob], 'audio.ogg', {type: 'audio/ogg' });
                            //cria um arquivo com o áudio gravado (isso pode ser enviado para o servidor)

                            //adiciona o link do áudio diretamente dentro da caidxa de texto.
                            textBox.value += `\nÁudio gravado: ${audioUrl}`;
                            //O link do áudio será adicionado no final do conteúdo da caixa de texto

                            recordButton.textContent = 'Gravar Áudio'; //Volta o botão ao estado inicial.
                        };

                        //Caso o usuário clique no botão enquanto a gravação estiver em andamento, ela será parada.
                        recordButton.onclick = function () {
                            if (mediaRecorder.state === 'recording') {
                                mediaRecorder.stop(); //para a gravaçao
                            }
                        };
                    })
                    .catch(function (error) {
                        //Caso o acesso ao microfone seja negado ou ocorra outro erro.
                        console.error('Erro ao acessar o microfone: ', error);
                    });
            }
        });
    }
});