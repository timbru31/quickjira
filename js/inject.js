(function () {
  const selection = window.getSelection();
  console.log(selection.toString());
  return selection.rangeCount > 0 ? selection.toString() : '';
})();
