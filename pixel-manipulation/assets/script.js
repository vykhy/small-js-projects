const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
canvas.width = 800
canvas.height = 450

const img1 = new Image()
img1.src = './assets/images/1.jpg'

img1.addEventListener('load', ()=>{
    ctx.drawImage(img1, 0, 0)
    const scannedData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const scannedImg = scannedData.data
    for(let i = 0; i<scannedImg.length; i += 4){
       const average = (+scannedImg[i] + +scannedImg[i+1] + +scannedImg[i+2])/3 
       scannedImg[i] = average
       scannedImg[i+1] = average
       scannedImg[i+2] = average
    }
    scannedData.data = scannedImg
    ctx.putImageData(scannedData, 0, 0)
})
