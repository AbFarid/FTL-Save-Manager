// 'use strict';

// document.querySelector('#backup').addEventListener('click', () => {
//     utils.backupSave();
// });

new Vue({
    el: '#app',
    data: {
        files: []
    },
    methods: {
        getBackups: function () {
            this.files = getBackups();
        }
    },
    beforeMount(){
        this.files = getBackups();
        console.log(this.files)
    }
});