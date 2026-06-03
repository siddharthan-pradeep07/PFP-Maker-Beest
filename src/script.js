document.querySelectorAll('.toggle-bar button').forEach(btn =>
{
    btn.addEventListener('click', () =>
    {
        document.querySelectorAll('.toggle-bar button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    });
});