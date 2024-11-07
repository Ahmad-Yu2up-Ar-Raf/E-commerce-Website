// // toggle index
// let barIcon = document.getElementById("hamburger-menu")
// let slideBar = document.getElementById("slide");

// barIcon.addEventListener("click", function(){
//   slideBar.classList.toggle("tampil")
// });



const navbarNav = document.querySelector('.navbar-nav');
// fungsi 
document.querySelector('#hamburger-menu').onclick = () => {
    navbarNav.classList.toggle('active')
}

const hamburger = document.querySelector('#hamburger-menu');


// cart 
let buttonCart = document.querySelectorAll('.cartbutton')
let cartCount = document.getElementById('cartcount')
const cartMenuIcon = document.querySelectorAll("#cart-menu")
const boxButton = document.querySelector(".extra-box-button")
let number; 


number = 0

cartMenuIcon.forEach((MenuIcon) => MenuIcon.addEventListener("click", (e) => {
    number++ 
    cartCount.style.display = "inline"
    cartCount.innerText = number
    e.preventDefault()
}))

buttonCart.forEach((button) =>
    button.addEventListener("click", () => {
        number++ 
        cartCount.style.display = "inline"
        cartCount.innerText = number
    }  ))
    
    // toggle 
    const shopIcon = document.getElementById('cart')
    const shopSlide = document.querySelector('.cart-slide')
    const trash = document.querySelectorAll("#trash2")
    
    shopIcon.addEventListener("click", () => {
        shopSlide.classList.toggle("tampil")
        
    })
    boxButton.addEventListener("click", () => {
        number++ 
        cartCount.style.display = "inline"
        cartCount.innerText = number
    })
    
    //    trash.forEach((button) => button.addEventListener("click", () => {
        
        //    }))

// toggle search
        const searchIcon = document.getElementById('mecari')
        const searchSlide = document.querySelector('.Search')
      

    searchIcon.addEventListener("click", () => {
        searchSlide.classList.toggle("hadir")
    })



// box 
const eyesIcon = document.querySelectorAll("#eyes-menu")
const box = document.getElementById("box")
const boxClose = document.getElementById("close")
const q = document.getElementById("cart-icon")



eyesIcon.forEach((icon) => icon.addEventListener("click", (e) => {
    box.style.display = "flex"
    e.preventDefault()
}))

boxClose.addEventListener("click", () => {
    box.style.display = "none"
})

window.addEventListener("click", (e) => {
    if (e.target === box){
        box.style.display = "none"
    }
}
)


    document.addEventListener('click',function(e){
        if(!hamburger.contains(e.target) && !navbarNav.contains(e.target)){
           navbarNav.classList.remove('active') 
        }
        if (!shopIcon.contains(e.target) && !shopSlide.contains(e.target) && e.target.id !== 'cart-icon') {
            shopSlide.classList.remove('tampil');
        }
        if(!searchIcon.contains(e.target) && !searchSlide.contains(e.target)){
            searchSlide.classList.remove('hadir') 
         }
    })

    // cart sytem
    document.addEventListener('alpine:init', () => {
        Alpine.data('products', ()  => ({
            items:[
                { id:1, name:'Ayam geprek', img: 'images/1.png', price:17000},
                { id:2, name:'Chiken mozzarella', img: 'images/2.png', price:23000},
                { id:3, name:'Chiken Hot', img: 'images/3.png', price:14000},
                { id:4, name:'Pizza go', img: 'images/4.png', price:20000},
                { id:5, name:'Cheese Burger', img: 'images/5.png', price:20000},
            ]
        }))
        Alpine.store('cart',{
            items:[],
            total:0,
            quantity:0,
            add(newItem){
                // cek apakah ada barang yang sama 
                const cartItem = this.items.find((item) => item.id === newItem.id)

                if(!cartItem){

                    this.items.push({...newItem, quantity:1, total:newItem.price});
                    this.quantity++
                    this.total += newItem.price
                }else{
                    this.items = this.items.map((item) => {
                        if(item.id !== newItem.id){
                            return item
                        }else{
                            item.quantity++
                            item.total = item.price * item.quantity
                            this.quantity++
                            this.total += item.price
                            return item
                        }
                    })
                }
  
            },
            remove(id){
                // ambil item yang mau di remove id nya
                const cartItem = this.items.find((item) => item.id === id)
           
                // jika item lebih dari 1`
            if(cartItem.quantity > 1){
                // telusuri 1 1
                this.items = this.items.map((item) => {
// jika bukan barang yang diklik
                    if(item.id !== id){
                        return item
                    }else {
                        item.quantity--
                        item.total = item.price * item.quantity
                        this.quantity--
                        this.total -= item.price
                        return item
                    }
                })
            }else if (cartItem.quantity === 1){
                // jika barangnya sisa 1
                this.items = this.items.filter((item) => item.id !== id)
                this.quantity--
                this.total -= cartItem.price
            }
           }
        })
    })

// // form validation
const CheckoutButton = document.querySelector('.checkout-button')
CheckoutButton.disabled = true

const form = document.querySelector('#checkoutform')

form.addEventListener('keyup', function(){
    for(let i = 0; i < form.elements.length; i++){
        if(form.elements[i].value.length !== 0){
            CheckoutButton.classList.remove('disabled')
            CheckoutButton.classList.add('disabled')
        } else {
            return false
        }
    }
    CheckoutButton.disabled = false
    CheckoutButton.classList.remove('disabled')
})

// console.log(CheckoutButton)
// console.log(form)

// kirim data
CheckoutButton.addEventListener("click", async function(e) {
    e.preventDefault()
    const formData = new FormData(form)
    const data = new URLSearchParams(formData)
    const objData = Object.fromEntries(data)
    
    // minta transaction token make ajax
    try{
        const response = await fetch('php/placeHolder.php', {
            method: 'POST',
            body: data,
        })
        const token = await response.text()
        // console.log(token)
        window.snap.pay(token);
    }catch(err){
        console.log(err.massage)
    }
    
})

// const massage = formatMassage(objData)
// window.open('http://wa.me/6285890927775?text=' + encodeURIComponent(massage))
// pesan wa
const formatMassage = (obj) => {
    return `Data Customer
    Nama: ${obj.name}
    Email: ${obj.email}
    No Hp: ${obj.phone}
Data Pesanan
${JSON.parse(obj.items).map((item) => `${item.name} (${item.quantity} x ${rupiah(item.total)}) \n`)}
   TOTAL: ${rupiah(obj.total)}
   Terima Kasih.
   `
}

// conversi
    const rupiah = (number) => { 
         return new Intl. NumberFormat('id-ID', { 
            style: 'currency',
             currency: 'IDR', 
            minimumFractionDigits: 0, 
         }).format(number);
        };

console.log("helloworld")