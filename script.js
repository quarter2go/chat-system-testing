import { initializeApp }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
getFirestore,
collection,
doc,
setDoc,
onSnapshot
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
getStorage,
ref,
uploadBytes,
getDownloadURL
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

const firebaseConfig = {
apiKey: "AIzaSyCIbHvkDSwYmEAijiRmBwKEBXen-faujTs",
authDomain: "chat-for-cuori.firebaseapp.com",
projectId: "chat-for-cuori",
storageBucket: "chat-for-cuori.firebasestorage.app",
messagingSenderId: "278337182213",
appId: "1:278337182213:web:f2b43dcda98e2a2c421a6c",
measurementId: "G-8LCVNCQF6R"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const storage = getStorage(app);

const modal = document.getElementById("modal");
const addBtn = document.getElementById("addBtn");
const publishBtn = document.getElementById("publishBtn");

addBtn.onclick = () => {
modal.classList.remove("hidden");
};

let profiles = [];
let current = 0;

function showProfile() {

if(profiles.length === 0){
return;
}

const p = profiles[current];

document.getElementById("profileImage").src =
p.imageUrl || "";

document.getElementById("name").textContent =
p.name || "";

document.getElementById("major").textContent =
p.major || "";

document.getElementById("about").textContent =
p.about || "";

document.getElementById("looking").textContent =
"Looking For: " + (p.looking || "");
}

publishBtn.onclick = async () => {

const name =
document.getElementById("nameInput")
.value.trim();

if(!name) return;

let imageUrl = "";

const file =
document.getElementById("imageInput")
.files[0];

if(file){

```
const imageRef =
ref(storage,"profiles/" + name);

await uploadBytes(
  imageRef,
  file
);

imageUrl =
await getDownloadURL(
  imageRef
);
```

}

await setDoc(
doc(db,"profiles",name),
{
name,

```
  major:
  document.getElementById("majorInput")
  .value,

  about:
  document.getElementById("aboutInput")
  .value,

  looking:
  document.getElementById("lookingInput")
  .value,

  imageUrl
}
```

);

modal.classList.add("hidden");
};

onSnapshot(
collection(db,"profiles"),
(snapshot)=>{

```
profiles = [];

snapshot.forEach((docSnap)=>{

  profiles.push(
    docSnap.data()
  );

});

if(current >= profiles.length){
  current = 0;
}

showProfile();
```

}
);

document
.getElementById("nextBtn")
.onclick = ()=>{

if(profiles.length===0) return;

current++;

if(current >= profiles.length){
current = 0;
}

showProfile();
};

document
.getElementById("prevBtn")
.onclick = ()=>{

if(profiles.length===0) return;

current--;

if(current < 0){
current =
profiles.length - 1;
}

showProfile();
};
