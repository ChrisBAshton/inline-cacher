// give the demo a chance to reset the cookie easily
document.querySelector("button").addEventListener("click", function() {
  // delete the cookie
  document.cookie =
    "style-cookies=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  // clear the locally cached styles
  localStorage.removeItem("styleCookies");
  // refresh to see inline styles again
  window.location.href = window.location.href;
});

// this is where the magic happens

if (localStorage.styleCookies) {
  var head = document.getElementsByTagName("head")[0];
  var s = document.createElement("style");
  s.setAttribute("type", "text/css");
  s.appendChild(document.createTextNode(localStorage.styleCookies));
  head.appendChild(s);
  console.log("localStorage.styleCookies", localStorage.styleCookies);
} else {
  const styles = document.getElementsByTagName("style");
  let stylesString = ``;
  for (let i = 0; i < styles.length; i++) {
    const style = styles[i];
    stylesString += style.textContent;
  }
  console.log(stylesString);
  localStorage.setItem("styleCookies", stylesString);
  document.cookie = "style-cookies=true"; // subsequent requests to the server tell it not to send inline styles
}
