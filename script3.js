import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import { getStorage, ref, uploadBytes } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-storage.js';
//python3 -m venv myenv
//source myenv/bin/activate

//http://localhost:8000/
//open -n -a /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --args --user-data-dir="/tmp/chrome_dev_test" --disable-web-security
//python3 -m http.server
//"C:\Program Files\Google\Chrome\Application\chrome.exe" --user-data-dir="C:\tmp\chrome_dev_test" --disable-web-security ----> windows


const firebaseConfig = {
  apiKey: "AIzaSyDlX7bz5gmMNWAawlWwV1_8Iny2FR0FqjE",
  authDomain: "quickdraw-fce0d.firebaseapp.com",
  projectId: "quickdraw-fce0d",
  storageBucket: "quickdraw-fce0d.appspot.com",
  messagingSenderId: "292914674994",
  appId: "1:292914674994:web:031f03d203b8e7b18e6b2b"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

const canvas = document.getElementById('meuCanvas');
const ctx = canvas.getContext('2d');
const limparButton = document.getElementById('limparButton');


let isDrawing = false;
let lastX = 0;
let lastY = 0;

function limparCanvas() {
    preencherFundo('white'); // Preenche o fundo com a cor branca
    ctx.beginPath(); // Reinicia o caminho do desenho
}

function preencherFundo(cor) {
    ctx.fillStyle = cor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function ajustarCanvas() {
    const size = Math.min(window.innerWidth, window.innerHeight);
    canvas.width = size/1.2;
    canvas.height = size/1.2;
    preencherFundo('white'); // Preenche o fundo com a cor branca após ajustar o tamanho
}

window.addEventListener('resize', ajustarCanvas);
ajustarCanvas(); // Ajusta o canvas ao carregar a página

canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    lastX = e.offsetX;
    lastY = e.offsetY;
});

canvas.addEventListener('mousemove', (e) => {
    if (isDrawing) {
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();

        lastX = e.offsetX;
        lastY = e.offsetY;
    }
});

canvas.addEventListener('mouseup', () => {
    isDrawing = false;
});

limparButton.addEventListener('click', () => {
    limparCanvas();
});

document.addEventListener('DOMContentLoaded', () => {
    let answer = document.getElementById('answer');
    const continuar = document.getElementById('continuar');
    const continuarButton = document.getElementById('continuarButton');
    const analizarButton = document.getElementById('analizarButton');
    const capturarButton = document.getElementById('capturarButton');
    const abaI = document.getElementById('abaI');
    const abaAnterior = document.getElementById('abaAnterior');
    const abaProxima = document.getElementById('abaProxima');
    const borrachaButton = document.getElementById('borrachaButton');
    const desenhoButton = document.getElementById('desenhoButton');
    let desenhando = false;
    let modoBorracha = false;
    let x = 0;
    let y = 0;

    /*function preencherFundo(cor) {
        ctx.fillStyle = cor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }*/

    analizarButton.addEventListener('click', async function(){
        setText()
    });

    async function setText(){
        let a = await fetchData();
        answer.textContent = a;
        console.log(`${a} - hm...`);
    }

    async function fetchData() {

        return new Promise((resolve, reject) => {

            console.log("Fetching data...");

            fetch('http://127.0.0.1:5000/data', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                console.log('Data received:', data);
                const predictedClass = data['predicted class name'];
                console.log(predictedClass);
                resolve(predictedClass);
            })
            .catch((error) => {
                console.error('Fetch failed', error);
                reject('Error');
            });
    
        });
        
    }

    /*setInterval(setText(), 500);
    setInterval(() => {
        saveImageToFolder(canvas.toDataURL('image/png'), 'image');
    }, 2000);*/
    
    capturarButton.addEventListener('click', function() {
        try {
            const dataURL = canvas.toDataURL('image/png');
            const blob = dataURItoBlob(dataURL);
            const formData = new FormData();
            formData.append('image', blob, 'desenho.png'); // Adiciona o blob como um arquivo
            saveImageToFolder(canvas.toDataURL('image/png'), 'image');
        } catch (error) {
            console.error('Error saving image:', error);
        }
    });
    
    function saveImageToFolder(imageUrl, imageName) {
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = `${imageName}.png`;
        link.click();
    }
    
    
    
    function dataURItoBlob(dataURI) {
        var byteString;
        if (dataURI.split(',')[0].indexOf('base64') >= 0)
            byteString = atob(dataURI.split(',')[1]);
        else
            byteString = unescape(dataURI.split(',')[1]);

        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
        var arrayBuffer = new ArrayBuffer(byteString.length);
        var _ia = new Uint8Array(arrayBuffer);
        for (var i = 0; i < byteString.length; i++) {
            _ia[i] = byteString.charCodeAt(i);
        }

        var dataView = new DataView(arrayBuffer);
        var blob = new Blob([dataView], { type: mimeString });
        return blob;
    }

    continuar.addEventListener('click', () => {
        abaI.style.display = 'none';
        abaAnterior.style.display = 'block';
    });

    continuarButton.addEventListener('click', () => {
        abaAnterior.style.display = 'none';
        abaProxima.style.display = 'flex';

    });

    canvas.addEventListener('mousedown', (e) => {
        x = e.offsetX;
        y = e.offsetY;
        desenhando = true;
    });

    canvas.addEventListener('mouseup', () => {
        desenhando = false;
        ctx.beginPath();
    });

    canvas.addEventListener('mousemove', (e) => {
        if (desenhando) {
            desenhar(x, y, e.offsetX, e.offsetY);
            x = e.offsetX;
            y = e.offsetY;
        }
    });

    function desenhar(x1, y1, x2, y2) {
        ctx.strokeStyle = modoBorracha ? 'white' : 'black';
        ctx.lineWidth = modoBorracha ? 20 : 5;
        ctx.lineCap = 'round';

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.closePath();
    }

    limparButton.addEventListener('click', () => {
        limparCanvas();
    });

    borrachaButton.addEventListener('click', () => {
        modoBorracha = true;
        borrachaButton.style.display = 'none';
        desenhoButton.style.display = 'inline';
    });

    desenhoButton.addEventListener('click', () => {
        modoBorracha = false;
        borrachaButton.style.display = 'inline';
        desenhoButton.style.display = 'none';
    });

    preencherFundo('white');
});
