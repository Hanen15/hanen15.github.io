function checkLogin() {
  let password = document.getElementById("admin-password").value;

  if (password === "doctor") {   
    document.getElementById("admin-login").style.display = "none";
    let panel = document.getElementById("admin-manager");
    panel.style.display = "block";
    panel.style.width = "100%"; 
  } else {
    alert("Password is wrong ❌");
    document.getElementById("admin-password").value = "";
  }
}


let title =document.getElementById('titleinput');
let img =document.getElementById('imginput');
let price =document.getElementById('priceinput');
let ads =document.getElementById('adsinput');
let taxes =document.getElementById('taxesinput');
let discount =document.getElementById('discountinput');
let total =document.getElementById('total');
let count =document.getElementById('countinput');
let category =document.getElementById('categoryinput');
let submit =document.getElementById('submit');
let mood ='create';
let index;
//Total
function getTotal(){
    if(price.value != ''){
        let result = (Number(price.value)+Number(taxes.value)+Number(ads.value))-Number(discount.value);
        total.innerHTML = result;
        total.style.background =' rgb(167, 214, 172) ';
    }else{
         total.innerHTML = '';
         total.style.background ='beige';
    }
}
//create
let datamed;
if(localStorage.medicat != null){
    datamed=JSON.parse(localStorage.medicat);
}else{
    datamed = [];
}
submit.onclick = function(){
    let newmed={
        title :title.value,
        price :price.value,
        taxes :taxes.value,
        ads :ads.value,
        discount :discount.value,
        total :total.innerHTML,
        count :count.value,
        category :category.value,
        image:imginput.value,
    }
    if(title.value!=''&&price.value!=''&&category.value!=''&&Number(newmed.count)<100){
        if(mood ==="create"){
            if(newmed.count > 1){
                for(let i=0;i<newmed.count;i++){
                    datamed.push(newmed);
                }
            }else{
                datamed.push(newmed);
            }
        }else{
            datamed[ index ]= newmed ;
            mood ='create';
            submit.innerHTML='Create';
            count.style.display = 'block';
        }
        cleardata();
    }
    localStorage.setItem('medicat',JSON.stringify(datamed));
    showdata();
}
//clear inputs
function cleardata(){
    title.value='';
    price.value='';
    taxes.value='';
    ads.value='';
    discount.value='';
    total.innerHTML='';
    count.value='';
    category.value='';
    total.style.background ='beige';
}
//read
function showdata(){
    getTotal();
    let table='';
    for(let i=0;i<datamed.length;i++){
        table+=`
        <tr>
            <td>${i+1}</td>
            <td>${datamed[i].title}</td>
            <td>${datamed[i].price}</td>
            <td>${datamed[i].taxes}</td>
            <td>${datamed[i].ads}</td>
            <td>${datamed[i].discount}</td>
            <td>${datamed[i].total}</td>
            <td>${datamed[i].category}</td>
            <td><button onclick="updatedata(${i})" id="update">Update</button></td>
            <td><button onclick="deletedata(${i})" id="delete">Delete</button></td>
        </tr>`
        
    }

    document.getElementById('tbody').innerHTML= table;
    let btndeleteall = document.getElementById('deleteall');  
    if(datamed.length>0){
        btndeleteall.innerHTML = `<button onclick="delall()">Delete All (${datamed.length})</button>`;
    }else{
        btndeleteall.innerHTML = '';
    }         
}
showdata();
//delete
function deletedata(i){
    datamed.splice(i,1);
    localStorage.medicat = JSON.stringify(datamed);
    showdata();
}
//deleteall
function delall(){
    localStorage.clear();
    datamed.splice(0);
    showdata();
}
//update
function updatedata(i){
    title.value = datamed[i].title;
    price.value = datamed[i].price;
    taxes.value = datamed[i].taxes;
    ads.value = datamed[i].ads;
    discount.value = datamed[i].discount;
    getTotal();
    count.style.display='none';
    category.value = datamed[i].category;
    submit.innerHTML='Update';
    mood = 'update';
    index = i;
}
//search
let searchcond= 'title';
function getsearch(id){
    let search = document.getElementById('search');
    if(id == 'searchtit'){
        searchcond= 'title';
        search.placeholder ='Search By Title';
    }else{
        searchcond= 'category';
        search.placeholder ='Search By Category';
    }
    search.focus()
    search.value='';
    showdata()
}

function searchdata(value){
    let table ='';
    if(searchcond == 'title'){
        for(let i=0;i<datamed.length;i++){
            if(datamed[i].title.toLowerCase().includes(value.toLowerCase())){
                table +=`
                  <tr>
                    <td>${i+1}</td>
                    <td>${datamed[i].title}</td>
                    <td>${datamed[i].price}</td>
                    <td>${datamed[i].taxes}</td>
                    <td>${datamed[i].ads}</td>
                    <td>${datamed[i].discount}</td>
                    <td>${datamed[i].total}</td>
                    <td>${datamed[i].category}</td>
                    <td><button onclick="updatedata(${i})" id="update">Update</button></td>
                    <td><button onclick="deletedata(${i})" id="delete">Delete</button></td>
                  </tr>`;
            }
        }
        
    }else{
         for(let i=0;i<datamed.length;i++){
            if(datamed[i].category.toLowerCase().includes(value.toLowerCase())){
                table +=`
                  <tr>
                    <td>${i+1}</td>
                    <td>${datamed[i].title}</td> 
                    <td>${datamed[i].price}</td>
                    <td>${datamed[i].taxes}</td>
                    <td>${datamed[i].ads}</td>
                    <td>${datamed[i].discount}</td>
                    <td>${datamed[i].total}</td>
                    <td>${datamed[i].category}</td>
                    <td><button onclick="updatedata(${i})" id="update">Update</button></td>
                    <td><button onclick="deletedata(${i})" id="delete">Delete</button></td>
                  </tr>`;
            }
        }

    }
    document.getElementById('tbody').innerHTML= table;
}

