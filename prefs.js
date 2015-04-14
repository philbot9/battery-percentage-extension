const Gtk = imports.gi.Gtk;
const Convenience = imports.misc.extensionUtils.getCurrentExtension().imports.convenience;
const Lang = imports.lang;
const HIDE_WHEN_FULL_KEY = "hide-when-full";

function init(){
}

function buildPrefsWidget() {
    let preferences = Convenience.getSettings();
    
    let frame = new Gtk.Box({
        orientation: Gtk.Orientation.VERTICAL,
        border_width: 10
    });

    let hbox = new Gtk.Box({
        orientation: Gtk.Orientation.HORIZONTAL
    });

    let vbox = new Gtk.Box({
        orientation: Gtk.Orientation.VERTICAL,
        margin: 20,
        margin_top: 10
    });

    let settingLabel = new Gtk.Label({
        label: "Hide percentage when battery is fully charged:",
        xalign: 0
    });


    let hideWhenFull = new Gtk.Switch({
        active: preferences.get_boolean(HIDE_WHEN_FULL_KEY)
    });
    hideWhenFull.connect('notify::active', function(object){
        preferences.set_boolean(HIDE_WHEN_FULL_KEY, object.active);
    });
    
    settingLabel.set_tooltip_text("Hide the percentage when the battery is fully charged.");
    hideWhenFull.set_tooltip_text("Hide the percentage when the battery is fully charged.");

    hbox.pack_start(settingLabel, true, true, 0);
    hbox.add(hideWhenFull);
    
    vbox.add(hbox);

    frame.add(vbox);
    frame.show_all();
    return frame;
}


