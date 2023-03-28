import { alert } from 'ui/components';
import { directive, dom, emitter, node, render } from 'ui/lib';
import { user } from 'dapp';
import manifest from './dapp/manifest';


let cache = [],
    initiated = false;


const nodapps = () => `
    <div class="card --background-grey-400 --border-radius-600 --flex-center --margin-top --margin-200 --padding --padding-800">
        <div class='--text-center'>
            No DApps found for contract
        </div>
    </div>
`;

const template = (data) => `
    <div class="card --background-white-400 --border-radius-600 --margin-top --margin-200 --padding --padding-500">
        <div class="--flex-row">
            <img alt="" class='image --background-black-500 --border-radius --border-radius-500 --flex-fixed --margin-right --margin-300 --size-800' src="">

            <div class="--flex-fill --flex-vertical">
                <div class="text-list --text-crop-top">
                    <b class="text --text-500">
                        ${data.name}
                    </b>

                    <div class="text --color-text-300 --margin-0px --padding-right --padding-400 --text-100">
                        <span class="--text-truncate">
                            ${data.description}
                        </span>
                    </div>
                </div>

                <div class="list --margin-100">
                    <div class="list-item list-item--bulletpoint --background-black-400 --text-200">
                        <a class='link --color-secondary --color-state --color-text-500 --inline --text-bold' href='https://ipfs.io/ipfs/${data.ipfs}' target='_blank'>
                            Open Using IPFS Gateway
                        </a>
                    </div>
                    <div class="list-item list-item--bulletpoint --background-black-400 --text-200">
                        <a class='link --color-secondary --color-state --color-text-500 --inline --text-bold' href='https://cloudflare-ipfs.com/ipfs/${data.ipfs}' target='_blank'>
                            Open Using Cloudflare IPFS Gateway
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
`;

const init = async function() {
    let dapps,
        identity = await user.identity.get(),
        rows = (dom.ref('dapps.rows') || {}).element;

    if (!rows) {
        return;
    }

    dapps = await manifest.read();

    if (!dapps.length) {
        dom.update(() => {
            node.html(rows, { inner: nodapps() });
        });
        return;
    }

    dapps = dapps.map((response) => {
        let id = response.id.toString();

        cache[id] = response;
        cache[id].data.id = id;

        return cache[id].data;
    });

    dom.update(() => {
        node.html(rows, { inner: render.template(template, dapps) });
    });
}

emitter.on('user.init', () => {
    if (initiated) {
        return;
    }

    initiated = true;

    setTimeout(init, 1000);
});
