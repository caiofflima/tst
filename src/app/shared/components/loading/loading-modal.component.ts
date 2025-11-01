import {Component, OnInit, ViewEncapsulation} from '@angular/core';

declare let jQuery: any;
declare let Pace: any;

export class Loading {

    static start() {
        jQuery('#loading-modal').modal('show');
        jQuery('.pace').removeClass('pace-done');
        jQuery('.pace').removeClass('pace-inactive')
        jQuery('.pace').addClass('pace-running');
        jQuery('body').removeClass('pace-done');
        document.querySelector('body').style.paddingRight = '';
    }

    static stop() {
        this.hidePace();
    }

    static hidePace(): void {
        const modal = jQuery('#loading-modal');
        if (modal.is(':visible')) {
            modal.modal('hide');
            document.querySelector('body').style.paddingRight = '';
        }

        jQuery('.pace').removeClass('pace-running');
        jQuery('.pace').addClass('pace-inactive')
        jQuery('body').removeClass('pace-running');
    }
}

/**
 * Modal de carregando.
 */
@Component({
    selector: 'app-loading-modal',
    templateUrl: './loading-modal.component.html',
    styleUrls: ['./loading-modal.component.scss'],
    exportAs: 'Loading'
})
export class LoadingModalComponent implements OnInit {

    ngOnInit() {
        Pace.on('start', () => {
            jQuery('#loading-modal').modal('show');
            jQuery('body').removeClass('pace-done');
            document.querySelector('body').style.paddingRight = '';
        });
        Pace.on('done', this.hidePace);
        Pace.on('hide', this.hidePace);
        Pace.on('stop', this.hidePace);
    }

    public hidePace(): void {
        const modal = jQuery('#loading-modal');
        if (modal.is(':visible')) {
            modal.modal('hide');
            document.querySelector('body').style.paddingRight = '';
        }

        jQuery('body').removeClass('pace-running');
    }
}
