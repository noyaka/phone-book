//modal 
const modal = document.querySelector('#modal');
const modalBtn = document.querySelector('#modal-btn');
const closeBtn = document.querySelector('.close');

modalBtn.addEventListener('click', openModal);
closeBtn.addEventListener('click', closeModal);

function openModal() {
  clearInputFields();
  addBtn.innerText = "Add Contact";
  modal.style.display = 'block';
}

function closeModal() {
  modal.style.display = 'none';
}

const recordContainer = document.getElementById('record-container');
const addBtn = document.getElementById('submit-btn');
const clearBtn = document.getElementById('clear-btn');
const findLocationBtn = document.getElementById('location-btn');

const fullname = document.getElementById('fullname-inp');
const position = document.getElementById('position-inp');
const address = document.getElementById('address-inp');
const phonenumber = document.getElementById('phonenumber-inp');
const picture = document.getElementById('picture-inp');

let ContactArray = [];
let id = 0;

class Contact {
    constructor(id, fullname, position, address, phonenumber, picture) {
      this.id = id;
      this.fullname = fullname;
      this.position = position;
      this.address = address;
      this.phonenumber = phonenumber;
      this.picture = picture;
    }
}

// display available records
document.addEventListener('DOMContentLoaded', function() {
    if(localStorage.getItem('contacts') == null){
        ContactArray = [];
    } else {
        ContactArray = JSON.parse(localStorage.getItem('contacts'));
        getNextID(ContactArray);
    }
    displayRecord();
});

function getNextID(ContactArray) {
  if(ContactArray.length > 0){
    id = ContactArray[ContactArray.length - 1].id;
  } else {
      id = 0;
  }
}

function displayRecord() {
    ContactArray.forEach(function(singleContact){
        addToList(singleContact);
    });
}

clearBtn.addEventListener('click', function() {
  clearInputFields();
});

function clearInputFields() {
  fullname.value = "";
  position.value = ""
  address.value = "";
  phonenumber.value = "";
  picture.value = "";
  picture.innerText = "";
}

function isEmpty(str) {
  return str === "" || !str.replace(/\s/g, '').length;
}

function checkInputFields(inputArr) {
  let isValid = true;
  for(let i = 0; i < inputArr.length; i++) {
      if(isEmpty(inputArr[i].value)) {
        document.getElementById("validationError"+i).classList.remove("hide");
        isValid = false;
        return isValid;
      }
      else {
        isValid = true;
        if (!document.getElementById("validationError"+i).classList.contains("hide"))
            document.getElementById("validationError"+i).classList.add("hide");
      }
  }

  // check fullname
  if(!checkStr(inputArr[0].value)) {
    document.getElementById("validation-error0").classList.remove("hide");
    isValid = false;
    return isValid;
  }
  else {
    isValid = true;
    if (!document.getElementById("validation-error0").classList.contains("hide")){
        document.getElementById("validation-error0").classList.add("hide");
    }
  }

  // check position
  if(!checkStr(inputArr[1].value)) {
    document.getElementById("validation-error1").classList.remove("hide");
    isValid = false;
    return isValid;
  }
  else {
    isValid = true;
    if (!document.getElementById("validation-error1").classList.contains("hide")){
        document.getElementById("validation-error1").classList.add("hide");
    }
  }

  // check number
  if(!checknumber(inputArr[3].value) && inputArr[3].value !== "") {
    document.getElementById("validation-error3").classList.remove("hide");
    isValid = false;
    return isValid;
  }
  else {
    isValid = true;
    if (!document.getElementById("validation-error3").classList.contains("hide")){
        document.getElementById("validation-error3").classList.add("hide");
    }
  }
  return isValid;
}

function checknumber(number) {
  return /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im.test(number);
}

// check if str contains digits
function checkStr(str) {
  return !/\d/.test(str);
}

// add user
addBtn.addEventListener('click', function() {
  if(checkInputFields([fullname, position, address, phonenumber])) {

    // save user's picture if user did not choose a new one
    if (addBtn.value && isEmpty(picture.textContent)) {
      picture.innerText = addBtn.value;
    }
    getNextID(ContactArray);
    id ++;
    const contact = new Contact(id, fullname.value, position.value, address.value, phonenumber.value, picture.textContent);
    ContactArray.push(contact);
    localStorage.setItem('contacts', JSON.stringify(ContactArray));
    addBtn.value = "";
    clearInputFields();
    alert("User added successfully");
    addToList(contact);
    closeModal();
  } 
  else {
    clearInputFields;
  }
});

// edit user
recordContainer.addEventListener('click', function(event) {
  if(event.target.id === 'edit-btn') {
    let recordItem = event.target.parentElement;
    openModal();
    fullname.value = recordItem.children["fullname"].innerText;
    position.value = recordItem.children["position"].innerText;
    address.value = recordItem.children["address"].innerText;
    phonenumber.value = recordItem.children["phonenumber"].innerText.slice(5);
    addBtn.innerText = "Update Contact";

    // save user's existing picture
    let idToEdit = parseInt(recordItem.children["userId"].innerText);
    ContactArray.filter(function(record) {
      if (record['id'] === idToEdit){
        addBtn.value = record['picture'];
      } 
    });

    addBtn.addEventListener("click", function() {
      recordContainer.removeChild(recordItem);
      let tempContactList = ContactArray.filter(function(record) {
        return (record['id'] !== idToEdit);
      });
    ContactArray = tempContactList;
    localStorage.setItem('contacts', JSON.stringify(ContactArray));
    })
  }
});

// delete user
recordContainer.addEventListener('click', function(event) {
  if(event.target.id === 'delete-btn') {
    let recordItem = event.target.parentElement;
    let name = recordItem.children["fullname"].innerText;
    let isSure = window.confirm('Are you sure you want to delete ' + name + '?');
    if (isSure) {
      // remove from DOM
      let idToDel = parseInt(recordItem.children["userId"].innerText);
      recordContainer.removeChild(recordItem);
      let tempContactList = ContactArray.filter(function(record) {
          return (record['id'] !== idToDel);
      });
      ContactArray = tempContactList;
      localStorage.setItem('contacts', JSON.stringify(ContactArray));
    }
  }
});

// find location
findLocationBtn.addEventListener('click', () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showLocation);
  } else {
    address.value = "geolocation is not supported, please enter manually";
  }
});

const showLocation = async (position) => {
let response = await fetch(
  `https://nominatim.openstreetmap.org/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&format=json`
);
let data = await response.json();
address.value = `${data.display_name}`;
};

//display images
picture.addEventListener("change", (event) => {
  let file = event.target.files[0];
  let picReader = new FileReader();
  let pic = document.createElement('div');
  picReader.addEventListener("load", function(event){
    let picFile = event.target;
    pic.innerHTML = `<img src="${picFile.result}" style="border-radius: 50%; display:inline-block; padding-top:0px;">`;
    picture.innerText = pic.innerHTML;
  })
  picReader.readAsDataURL(file);
})

// Adding to DOM
function addToList(item) {
    const newRecordDiv = document.createElement('div');
    newRecordDiv.className = 'single-record';
    newRecordDiv.id = 'single-record';
    
    // picture
    let pictureDiv = document.createElement('div');
    if(item.picture === ""){
      // assign a default picture
      pictureDiv.innerHTML = `<img src="/assets/michael-zimber.jpg" style="border-radius: 50%; display:inline-block; padding-top: 0px;">`;
    }
    else {
      pictureDiv.innerHTML = item.picture;
    }
    pictureDiv.id = "picture";
    pictureDiv.classList = "record-el-left";

    // user id
    let userIdDiv = document.createElement('div');
    userIdDiv.id = 'userId';
    userIdDiv.textContent = item.id;

    // full name
    let fullnameDiv = document.createElement('div');
    fullnameDiv.id = 'fullname';
    fullnameDiv.className = 'record-el-center';
    fullnameDiv.textContent = item.fullname;

    // position
    let positionDiv = document.createElement('div');
    positionDiv.id = 'position';
    positionDiv.className = 'record-el-left';
    positionDiv.textContent = item.position;

    // location icon
    let iconDiv = document.createElement('div');
    iconDiv.className = 'record-el-center';
    iconDiv.id = 'icon-btn';
    iconDiv.classList.add('fas', 'fa-map-marker-alt');

    // address
    let addressDiv = document.createElement('div');
    addressDiv.id = 'address';
    addressDiv.className = 'record-el-center';
    addressDiv.textContent = item.address; 

    // phone number
    let phonenumberDiv = document.createElement('div');
    phonenumberDiv.id = 'phonenumber';
    phonenumberDiv.className = 'record-el-center';
    phonenumberDiv.innerHTML = '<br><br><ins>P:</ins> '+item.phonenumber;

    // edit button
    let editBtn = document.createElement('button');
    editBtn.className = 'record-el';
    editBtn.id = 'edit-btn';
    editBtn.innerHTML= '<i class="fa fa-pencil"></i>';

    // delete button
    let deleteBtn = document.createElement('button');
    deleteBtn.className = 'record-el';
    deleteBtn.id = 'delete-btn';
    deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';

    newRecordDiv.append(userIdDiv);
    newRecordDiv.append(fullnameDiv);
    newRecordDiv.append(pictureDiv);
    newRecordDiv.append(iconDiv);
    newRecordDiv.append(addressDiv);
    newRecordDiv.append(phonenumberDiv);
    newRecordDiv.append(positionDiv);
    newRecordDiv.append(deleteBtn);
    newRecordDiv.append(editBtn);
    recordContainer.appendChild(newRecordDiv);
}
