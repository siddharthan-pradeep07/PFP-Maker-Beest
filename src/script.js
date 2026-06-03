const buttons = document.querySelectorAll('.toggle-bar button');
const snippet_panel = document.getElementById('snippet-panel');

buttons.forEach(btn =>
{
    btn.addEventListener('click', () =>
    {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        if (btn.textContent === 'Background')
        {
            snippet_panel.classList.add('visible');
        }
        else
        {
            snippet_panel.classList.remove('visible');
        }
    });
});