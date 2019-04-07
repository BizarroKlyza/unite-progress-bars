// Helper functions

function createNode(element) {
    return document.createElement(element);
}

function append(parent, el) {
    return parent.appendChild(el);
}

// Select where the buttons will be appended
const btns = document.querySelector('.buttons');

// Select the progress select box
const selector = document.querySelector('#progress-select');

const url = 'https://pb-api.herokuapp.com/bars';

// Consume the API
fetch(url)
    .then((resp) => resp.json())
    .then(function(data) {
        let buttons = data.buttons; // button values

        // Make multiple progress bars
        data.bars.map((value, index) => {
            // Create a progress bar
            let p = createNode('div');
            p.classList.add('progress-bar');
            p.style.width = Math.round(value/data.limit*100) + '%';
            p.setAttribute("id", "progress-"+index);
            p.setAttribute("data-initial", value);



            // Append progress bar to container
            append(document.querySelector(".progress"), p);

            let per = createNode('span');
            per.classList.add('percentage');
            per.innerText = p.style.width;
            append(p, per);

            // Create the options
            let opt = createNode("option");
            opt.text = "#progress-"+index;
            selector.add(opt);

        });

        let selected = selector.options[selector.selectedIndex];
        let progress = document.querySelector('#progress-0');
        let initial = data.bars[0];

        selector.addEventListener('change', function(){
            selected = this.value;
            progress = document.querySelector(this.value);
            initial = progress.dataset.initial;
        });

        let limit = data.limit;

        document.querySelector(".percentage").innerText = progress.style.width;

        return buttons.map(function(button) {
            // Create the buttons
            let btn = createNode('input');
            btn.classList.add('btn');
            btn.setAttribute("type", "button");
            btn.setAttribute("value", (button<0?button:'+'+button));

            // Handle the clicks
            btn.addEventListener("click", function() {
                progress.dataset.initial = parseInt(progress.dataset.initial) + parseInt(btn.value);

                let percent = Math.round(parseInt(progress.dataset.initial)/parseInt(data.limit)*100);

                if (progress.dataset.initial >= limit) {
                    progress.style.width = 100 + '%';
                    progress.style.backgroundColor = 'red';
                } else if (progress.dataset.initial <= 0) {
                    progress.dataset.initial = 0;
                    percent = 0;
                    progress.style.width = 0 + '%';
                } else {
                    progress.style.width = percent + '%';
                    progress.style.backgroundColor = 'green';
                }

                progress.querySelector(".percentage").innerText = percent + '%';

            });
            append(btns, btn);
        })
    })
    .catch(function(error) {
        console.log(error);
    });
