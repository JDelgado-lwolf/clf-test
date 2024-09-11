import { debounce } from 'lodash-es';

export default class TextFloatingFilterComponent {
    init(params) {
        this.eGui = document.createElement('div');
        this.eGui.className = `${params.classNames?.join(' ')} w-100 p-1`;
        this.eGui.innerHTML = '<input type="text" class="d-inline-block form-control ag-custom-float-filter" />';

        this.eFilterInput = this.eGui.querySelector('input');
        this.eFilterInput.placeholder = params.placeholder;

        const onInputBoxChanged = () => {
            if (this.eFilterInput.value === '') {
                // clear the filter
                params.parentFilterInstance(instance => {
                    instance.onFloatingFilterChanged(null, null);
                });
                return;
            }
            params.parentFilterInstance(instance => {
                instance.onFloatingFilterChanged('contains', this.eFilterInput.value);
            });
        };

        this.eFilterInput.addEventListener('input', debounce(onInputBoxChanged, 500));
    }

    onParentModelChanged(parentModel) {
        // When the filter is empty we will receive a null message here
        if (!parentModel) {
            this.eFilterInput.value = '';
        } else {
            this.eFilterInput.value = parentModel.filter ?? '';
            // todo: if we want to show multiple filters (could also add type i.e. contains, startsWith, notEqual, etc.)
            // this.eFilterInput.value = parentModel.filter
            //     ? parentModel.filter
            //     : parentModel.condition1 && parentModel.condition2
            //         ? `${parentModel.condition1.filter} ${parentModel.operator} ${parentModel.condition2.filter}`
            //         : '';
        }
    }

    getGui() {
        return this.eGui;
    }
};
