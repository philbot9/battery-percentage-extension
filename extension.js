
const Lang = imports.lang;
const Clutter = imports.gi.Clutter;
const St = imports.gi.St;
const Main = imports.ui.main;
const Tweener = imports.ui.tweener;
const Power = imports.ui.status.power;

let percentageText;
let signalId;

function init() {
}

function getPower() {
    return Main.panel.statusArea["aggregateMenu"]._power;
}

function batteryIsCharging(power) {
    return power.IsPresent ? power.TimeToFull !== 0 : false;
}

function batteryIsDischarging(power) {
    return power.IsPresent ? power.TimeToEmpty !== 0 : false;
}

function _onPowerChanged() {
    if (batteryIsCharging(this._proxy) || batteryIsDischarging(this._proxy)) {
        percentageText.set_text("%d%%".format(this._proxy.Percentage));
        percentageText.show();
    } else {
        percentageText.hide();
    }
}

function enable() {
    let power = getPower();
    percentageText = new St.Label({ text: "", y_align: Clutter.ActorAlign.CENTER });
    power.indicators.add_child(percentageText);

    signalId = power._proxy.connect('g-properties-changed', Lang.bind(power, _onPowerChanged));
    _onPowerChanged.call(power);
}

function disable() {
    percentageText.destroy();
    getPower()._proxy.disconnect(signalId);
}
