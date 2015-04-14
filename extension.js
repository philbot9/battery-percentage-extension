const Lang = imports.lang;
const Clutter = imports.gi.Clutter;
const St = imports.gi.St;
const Main = imports.ui.main;
const Tweener = imports.ui.tweener;
const Power = imports.ui.status.power;
const FULLY_CHARGED = Power.UPower.DeviceState.FULLY_CHARGED;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Convenience = Me.imports.convenience;
const HIDE_WHEN_FULL_KEY = "hide-when-full";

let percentageText;
let signalId;

let preferencesSchema;
let prefHideWhenFullSignalId;
let prefHideWhenFull;

function init() {
}

function getPower() {
    return Main.panel.statusArea["aggregateMenu"]._power;
}

function _onPowerChanged() {
    if(!this._proxy.IsPresent) {
        percentageText.hide();
        return;
    }

    if(!prefHideWhenFull || this._proxy.State !== FULLY_CHARGED) {
        percentageText.set_text("%d%%".format(this._proxy.Percentage));
        percentageText.show();
    } else {
        percentageText.hide();
    }
}

function _onPrefHideWhenFullChanged() {
    prefHideWhenFull = this.get_boolean(HIDE_WHEN_FULL_KEY);
    _onPowerChanged.call(getPower());
}

function enable() {
    let power = getPower();
    percentageText = new St.Label({ text: "", y_align: Clutter.ActorAlign.CENTER });
    power.indicators.add_child(percentageText);

    signalId = power._proxy.connect('g-properties-changed', Lang.bind(power, _onPowerChanged));

    preferencesSchema = Convenience.getSettings();
    prefHideWhenFull = preferencesSchema.get_boolean(HIDE_WHEN_FULL_KEY);

    prefHideWhenFullSignalId = preferencesSchema.connect("changed::" + HIDE_WHEN_FULL_KEY,
            Lang.bind(preferencesSchema, _onPrefHideWhenFullChanged));

    _onPowerChanged.call(power);
}

function disable() {
    percentageText.destroy();
    getPower()._proxy.disconnect(signalId);
    preferencesSchema.disconnect(prefHideWhenFullSignalId);
}
