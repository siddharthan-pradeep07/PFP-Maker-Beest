const buttons = document.querySelectorAll('.toggle-bar button');
const preview_box = document.getElementById('preview-box');
const info_btn = document.getElementById('info-btn');
const fullview_close = document.getElementById('fullview-close');
const toggle_wrapper = document.querySelector('.toggle-wrapper');
const snippet_panel = document.getElementById('snippet-panel');
const popup_overlay = document.getElementById('popup-overlay');
const reserved_overlay = document.getElementById('reserved-overlay');
const reserved_btn = document.getElementById('reserved-btn');
const selections = {};
selections["Extra"] = [];

const layerOrder = 
[
    'Background', 
    'Character', 
    'Shirts', 
    'Eyes', 
    'Head ons',
    'Mouth', 
    'Cheeks', 
    'Extra'
];

const random_blocklist = 
{
    'Background': [],
    'Character':  ['empty.png'],
    'Shirts':     ['empty.png'],
    'Eyes':       ['empty.png'],
    'Head ons':   ['empty.png'],
    'Mouth':      ['empty.png', 'mouth-3.png'],
    'Cheeks':     [],
    'Extra':      ['empty.png']
};

function render_preview()
{
    preview_box.querySelectorAll('img').forEach(img => img.remove());

    layerOrder.forEach(layer =>
    {
        if (layer === 'Extra')
        {
            (selections.Extra || []).forEach(src =>
            {
                const img = document.createElement('img');
                img.src = src;
                img.style.position = 'absolute';
                img.style.width = '100%';
                img.style.height = '100%';
                img.style.objectFit = 'contain';
                preview_box.appendChild(img);
            });
            return;
        }

        if (selections[layer])
        {
            const img = document.createElement('img');
            img.src = selections[layer];
            img.style.position = 'absolute';
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = layer === 'Background' ? 'cover' : 'contain';
            preview_box.appendChild(img);
        }
    });
}

function showTab(tabName)
{
    document.querySelectorAll('.snippet-grid').forEach(grid =>
    {
        grid.classList.toggle('active', grid.dataset.tab === tabName);
    });
}

buttons.forEach(btn =>
{
    btn.addEventListener('click', () =>
    {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        showTab(btn.textContent);
    });
});

document.querySelectorAll('.snippet-grid img').forEach(img =>
{
    img.addEventListener('click', () =>
    {
        const activeTab =
            document.querySelector('.toggle-bar button.active').textContent;

        if (activeTab === 'Extra')
        {
            if (!selections.Extra) selections.Extra = [];
            if (img.classList.contains('selected'))
            {
                img.classList.remove('selected');
                selections.Extra = selections.Extra.filter(src => src !== img.src);
            }
            else
            {
                img.classList.add('selected');
                selections.Extra.push(img.src);
            }
            render_preview();
            return;
        }
        document.querySelectorAll
        (`.snippet-grid[data-tab="${activeTab}"] img`).forEach(i => i.classList.remove('selected'));

        if (img.src.includes('empty.png'))
        {
            delete selections[activeTab];
            render_preview();
            return;
        }

        img.classList.add('selected');
        selections[activeTab] = img.src;
        render_preview();
    });
});

showTab('Background');

info_btn.addEventListener('click', () =>
{
    toggle_wrapper.style.display = 'none';
    snippet_panel.style.display = 'none';
    preview_box.style.display = 'none';
    fullview_close.classList.add('visible');
});

document.getElementById('fullview-close-btn').addEventListener('click', () =>
{
    toggle_wrapper.style.display = 'flex';
    snippet_panel.style.display = 'block';
    preview_box.style.display = 'block';
    fullview_close.classList.remove('visible');
});

// document.getElementById('save-btn').addEventListener('click', () =>
// {
//     const canvas = document.createElement('canvas');
//     canvas.width = preview_box.offsetWidth;
//     canvas.height = preview_box.offsetHeight;
//     const ctx = canvas.getContext('2d');

//     const orderedSrcs = [];
//     layerOrder.forEach(layer =>
//     {
//         if (layer === 'Extra')
//         {
//             (selections.Extra || []).forEach(src =>
//             {
//                 orderedSrcs.push({ src, isBg: false });
//             });
//             return;
//         }
//         if (selections[layer])        {
//             orderedSrcs.push({ src: selections[layer], isBg: layer === 'Background' });
//         }
//     });

//     if (orderedSrcs.length === 0)
//     {
//         alert('No layers selected yet');
//         return;
//     }

//     let index = 0;

//     function drawNext()
//     {
//         if (index >= orderedSrcs.length)
//         {
//             const link = document.createElement('a');
//             link.download = 'pfp.png';
//             link.href = canvas.toDataURL('image/png');
//             link.click();
//             return;
//         }

//         const { src, isBg } = orderedSrcs[index];
//         const tempImg = new Image();
//         tempImg.src = src;
//         tempImg.onload = () =>
//         {
//             if (isBg)
//             {
//                 ctx.drawImage(tempImg, 0, 0, canvas.width, canvas.height);
//             }
//             else
//             {
//                 const size = Math.min(canvas.width, canvas.height);
//                 const x = (canvas.width - size) / 2;
//                 const y = (canvas.height - size) / 2;
//                 ctx.drawImage(tempImg, x, y, size, size);
//             }
//             index++;
//             drawNext();
//         };
//         tempImg.onerror = () =>
//         {
//             index++;
//             drawNext();
//         };
//     }

//     drawNext();
// });  

function do_download()
{
    fetch('http://localhost:5000/api/download',
    {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({combination: get_combination_key()})
    });

    const canvas = document.createElement('canvas');
    canvas.width = preview_box.offsetWidth;
    canvas.height = preview_box.offsetHeight;
    const ctx = canvas.getContext('2d');
    const orderedSrcs = [];

    layerOrder.forEach(layer =>
    {
        if (layer === 'Extra')
        {
            (selections.Extra || []).forEach(src =>
            {
                orderedSrcs.push({ src, isBg: false });
            });
            return;
        }
        if (selections[layer])
        {
            orderedSrcs.push({ src: selections[layer], isBg: layer === 'Background' });
        }
    });
    let index = 0;

    function draw_next()
    {
        if (index >= orderedSrcs.length)
        {
            const link = document.createElement('a');
            link.download = 'pfp.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
            return;
        }
        const {src,isBg} = orderedSrcs[index];
        const tempImg = new Image();
        tempImg.src = src;
        tempImg.onload = () =>
        {
            if (isBg)
            {
                ctx.drawImage(tempImg, 0, 0,canvas.width,canvas.height);
            }
            else
            {
                const size = Math.min(canvas.width, canvas.height);
                const x = (canvas.width - size) / 2;
                const y = (canvas.height - size) / 2;
                ctx.drawImage(tempImg, x, y, size, size);
            }
            index++;
            draw_next();
        };
        tempImg.onerror = () =>
        {
            index++;
            draw_next();
        };
    }
    draw_next();
}

function get_combination_key()
{
    const combo = {};
    layerOrder.forEach(layer =>
    {
        if (layer === 'Extra') combo[layer] = selections.Extra || [];
        else if (selections[layer]) combo[layer] = selections[layer];
    });
    return combo;
}

document.getElementById('save-btn').addEventListener('click', async () =>
{
    const combo = get_combination_key();
    const response = await fetch('http://localhost:5000/api/check_reservation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ combination: combo })
    });
    const data = await response.json();
    if (data.reserved)
    {
        document.getElementById('popup-title').textContent = `This PFP is reserved by ${data.reserved_by} as "${data.pfp_name}"`;
        document.getElementById('popup-sub').textContent = 'What would you like to do?';
        document.getElementById('popup-username').style.display = 'none';
        document.getElementById('popup-pfpname').style.display = 'none';
        document.getElementById('popup-actions').innerHTML = ` 
            <button class="popup-btn-secondary" id="popup-new-btn">Create new PFP instead</button>
            <button class="popup-btn-confirm" id="popup-anyway-btn">Download anyway</button>`;
        document.getElementById('popup-new-btn').addEventListener('click', () =>
        {
            popup_overlay.classList.remove('visible');
            document.getElementById('random-btn').click();
        });
        document.getElementById('popup-anyway-btn').addEventListener('click', () =>
        {
            popup_overlay.classList.remove('visible');
            do_download();
        });
    }
    else
    {
        document.getElementById('popup-title').textContent = "heyaa! this PFP hasn't been reserved!";
        document.getElementById('popup-sub').textContent = 'You can choose to reserve it or just download';
        document.getElementById('popup-username').style.display = 'block';
        document.getElementById('popup-pfpname').style.display = 'block';
        document.getElementById('popup-actions').innerHTML = ` 
            <button class="popup-btn-secondary" id="popup-download-btn">Just Download</button>
            <button class="popup-btn-confirm" id="popup-reserve-btn">Reserve this PFP</button>`;
        document.getElementById('popup-reserve-btn').addEventListener('click', async () =>
        {
            const username = document.getElementById('popup-username').value.trim();
            const pfpname = document.getElementById('popup-pfpname').value.trim();
            if (!username || !pfpname)
            {
                alert('heya! fill all the fields')
                return;
            }
            await fetch('http://localhost:5000/api/reserve',
            {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ combination: combo, reserved_by: username, pfp_name: pfpname })
            });
            popup_overlay.classList.remove('visible');
            do_download();
        });
        document.getElementById('popup-download-btn').addEventListener('click', () =>
        {
            popup_overlay.classList.remove('visible');
            do_download();
        });
    }
    popup_overlay.classList.add('visible');
});

reserved_btn.addEventListener('click', async ()=>
{
    const name = prompt('Enter your name to see you reservation:');
    if (!name) return;
    const res =await fetch ('http://localhost:5000/api/my-reservation',
    {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reserved_by: name })
    });
    const data = await res.json();
    if (!data.found)
    {
        alert('No reservation found for that name');
        return;
    }
    document.getElementById('reserved-title').textContent = `Your reserved PFP: "${data.pfp_name}"`;
    document.getElementById('reserved-sub').textContent = `Reserved by: ${name}`;
    reserved_overlay.classList.add('visible');

    document.getElementById('unreserve-btn').onclick = async () =>
    {
        await fetch('http://localhost:5000/api/unreserve',
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ combination: data.combination })
        });
        reserved_overlay.classList.remove('visible');
        alert('Reservation removed');
    };
});

document.getElementById('reserved-close-btn').addEventListener('click', () =>
{
    reserved_overlay.classList.remove('visible');
});

document.getElementById('random-btn').addEventListener('click', () =>
{
    document.querySelectorAll('.snippet-grid img').forEach(i => i.classList.remove('selected'));

    layerOrder.forEach(layer =>
    {
        const grid = document.querySelector(`.snippet-grid[data-tab="${layer}"]`);
        if (!grid) return;
        const blocked = random_blocklist[layer] || [];
        const images = Array.from(grid.querySelectorAll('img'))
        .filter(img => !blocked.some(b => img.src.includes(b)));
        if (images.length === 0) return;
        if (layer === 'Extra')
        {
            selections.Extra = [];
            const shuffled = images.sort(() => Math.random() - 0.5);
            const count = Math.floor(Math.random() * images.length)+1;
            shuffled.slice(0, count).forEach(img =>
            {
                img.classList.add('selected');
                selections.Extra.push(img.src);
            });
            return;
        }
        const random_img = images[Math.floor(Math.random() * images.length)];
        random_img.classList.add('selected');
        selections[layer] = random_img.src;
    });

    render_preview();
});
document.getElementById('random-btn').click();
