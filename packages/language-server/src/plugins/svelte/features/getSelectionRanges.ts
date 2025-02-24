import { walk } from 'estree-walker';
import { Position, SelectionRange } from 'vscode-languageserver';
import { mapSelectionRangeToParent, offsetAt, toRange } from '../../../lib/documents';
import { SvelteDocument } from '../SvelteDocument';
import { inStyleOrScript } from './utils';

// estree does not have start/end in their public Node interface,
// but the AST returned by svelte/compiler does. Type as any as a workaround.
type Node = any;

type OffsetRange = {
    start: number;
    end: number;
};

export async function getSelectionRange(svelteDoc: SvelteDocument, position: Position) {
    if (inStyleOrScript(svelteDoc, position)) {
        return null;
    }

    const {
        ast: { html }
    } = await svelteDoc.getCompiled();
    const transpiled = await svelteDoc.getTranspiled();
    const content = transpiled.getText();
    const offset = offsetAt(transpiled.getGeneratedPosition(position), content);

    let nearest: OffsetRange = html;
    let result: SelectionRange | undefined;

    walk(html, {
        enter(node: Node, parent: Node) {
            if (!parent) {
                // keep looking
                return;
            }

            if (!('start' in node && 'end' in node)) {
                this.skip();
                return;
            }

            const { start, end } = node;
            const isWithin = start <= offset && end >= offset;

            if (!isWithin) {
                this.skip();
                return;
            }

            if (nearest === parent) {
                nearest = node;
                result = createSelectionRange(node, result);
            }
        }
    });

    return result ? mapSelectionRangeToParent(transpiled, result) : null;

    function createSelectionRange(node: OffsetRange, parent?: SelectionRange) {
        const range = toRange(content, node.start, node.end);
        return SelectionRange.create(range, parent);
    }
}
