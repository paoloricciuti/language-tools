///<reference types="svelte" />
;function render() {

     const snapshot: any = {};;type $$ComponentProps =  {form: boolean, data: true };
    let { form, data }:/*Ωignore_startΩ*/$$ComponentProps/*Ωignore_endΩ*/ = $props();
;
async () => {};
return { props: {} as any as $$ComponentProps, exports: {} as any as { snapshot: any }, slots: {}, events: {} }}

export default class Page__SvelteComponent_ extends __sveltets_2_createSvelte2TsxComponent(__sveltets_2_with_any_event(render())) {
    constructor(options = __sveltets_2_runes_constructor(__sveltets_2_with_any_event(render()))) { super(options); }
    $$bindings = __sveltets_$$bindings('');
    get snapshot() { return render().exports.snapshot }
}