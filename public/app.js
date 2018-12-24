$( document ).ready(function() {
    $(".changeBookState").change(function() {
        this.form.submit();
    });
});