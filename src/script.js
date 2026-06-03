const buttons = document.querySelectorAll('.toggle-bar button');
const snippet_panel = document.getElementById('snippet-panel');
const preview_img = document.getElementById('preview-img');

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

document.querySelectorAll('.snippet-grid img').forEach(img =>
{
    img.addEventListener('click', () =>
    {
        document.querySelectorAll('.snippet-grid img').forEach(i => i.classList.remove('selected'));
        img.classList.add('selected');

        preview_img.src = img.src;
        preview_img.classList.add('visible');
    });
});