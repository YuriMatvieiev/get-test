var Errors = function (ids, errContainer="") {
  this.ids = ids;
  this.ErrContainer = document.getElementById(errContainer);

  this.Init = function () {
    for (let i of this.ids) {
      if (document.getElementById(i)) {
        document.getElementById(i).addEventListener('focus', function (e) {
          e.target.classList.remove("error");
        });
      }
    }
  }

  this.Init();

  this.ShowError = function(msg) {
    this.ErrContainer.innerText = msg;
    this.ErrContainer.style.display = "block";
  }
  this.HideError = function () {
    if (!!this?.ErrContainer){
      this.ErrContainer.style.display = "none";
    }
  }
  this.Highlight = function (ids) {
    for (let i of ids) {
      document.getElementById(i).classList.add("error");
    }
  }
  this.Clear = function () {
    for (let i of this.ids) {
      document.getElementById(i).classList.remove("error");
    }
  }
  this.ShowSnack = function (msg) {
    SnackBar({message: msg, icon: "danger", status: "red"});
  }
};
