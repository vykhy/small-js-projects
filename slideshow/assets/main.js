const images = ['1.jpg', '2.jpg','3.jpg', '4.jpg','5.jpg', '7.jpg','8.jpg']

const image = document.querySelector('.img')
const next = document.querySelector('.next')
const prev = document.querySelector('.prev')
let currentImage

class Image{
    constructor(src){
        this.src = src
    }
}
class LinkedList{
    constructor(){
        this.head = null
        this.length = 0
    }

    insert(node){
        if (this.head === null){
            this.head = node
            this.head.next = null
        }
        else{
            let current = this.head
            let next = current.next
            while(next != null){
                current = next
                next = current.next
            }
            current.next = node
            current.next.next = null
        }
        this.length++
        return true
    }

    insertAt(index, node){
        if(index > this.length) return 'invalid index'

        let i = 0
        let current = this.head
        let next = current.next
        while (i < index){
            current = next
            next = current.next
        }
        node.next = next
        current.next = node
    }
}

class DoublyLinkedList{
    constructor(){
        this.head = null
        this.tail = null

        this.length = 0
    }
    insert(node){
        if(this.head == null){
            this.head = node
            this.head.prev = null
            this.tail = node
        }
        else if(this.tail == null){
            this.tail = node
            this.tail.prev = this.head
            this.head.next = this.tail
            this.tail.next = null
        }
        else{
            node.next = null
            node.prev = this.tail
            this.tail.next = node
            this.tail = this.tail.next
        }
        this.length ++
    }
}

let imagesList = new DoublyLinkedList()
function init(){
        for(i=0;i<images.length;i++){
            let img = new Image(images[i])
            imagesList.insert(img)
        }
        currentImage = imagesList.head
        setImage()
    //console.log(imagesList)
}
init()

next.addEventListener('click', ()=>{
    if(currentImage.next === null) {
        currentImage = imagesList.head
        setImage()
    }
    else{
        currentImage = currentImage.next
        setImage()
    }    
})
prev.addEventListener('click', ()=>{
    if(currentImage.prev === null) {
        currentImage = imagesList.tail
        setImage()
    }
    else{
        currentImage = currentImage.prev
        setImage()
    }    
})
function setImage(){
    image.src = `./assets/images/${currentImage.src}`
}