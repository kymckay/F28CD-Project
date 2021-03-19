var selected;
(function () {
  var rows = document.querySelectorAll('#candid > tbody > tr'); 
  rows.forEach(tr => tr.addEventListener('click', () => {
    if(selected === tr){
      selected.classList.remove('selected');
      selected = undefined;
    }
    else {
      if(selected) selected.classList.remove('selected');
      selected = tr;
      tr.classList.add('selected');
    }
  }));
})();