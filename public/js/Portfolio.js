const Search = document.getElementById("Search");
const searchbox = document.getElementById("searchbox");
const Login_box = document.getElementById("Login_box");
const login_icon = document.getElementById('login_icon');
const bars = document.getElementById('bars');
const navbar = document.getElementById('navbar');
const iconBar = document.getElementById('iconBar');
const myform = document.getElementById('myform');
const Submit = document.getElementById('Submit');


// code for the search toggle button in header start
Search.addEventListener("click", function () {
  searchbox.classList.toggle("openbox");
});

document.addEventListener("click", function (e) {
  const element = e.target;
  if (!searchbox.contains(element) && !Search.contains(element)) {
    searchbox.classList.remove("openbox");
  }
});
// code for the search toggle button in header end


// code for the login toggle button in header start
login_icon.addEventListener("click", function () {
  Login_box.classList.toggle("openLogin");
});

document.addEventListener("click", function (e) {
  const element = e.target;
  if (!Login_box.contains(element) && !login_icon.contains(element)) {
    Login_box.classList.remove("openLogin");
  }
});
// code for the login toggle button in header end



bars.addEventListener("click", function () {
  navbar.classList.toggle("toggled");
})


Submit.addEventListener('submit', function (e) {
  e.preventDefault();
console.log('submit');
  const data = new FormData(myform);
  try {
    fetch('/SendMessage', {
      method: 'POST',
      body: data,
    }).then((res) => res.json()).then((data) => {
      console.log(data);
    }).catch((err) => {
      console.log(err.message)
    })
  } catch (err) {
    console.log(`message from try catch `, err.message);
  }

})