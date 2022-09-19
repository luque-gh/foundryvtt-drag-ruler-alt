//Use this in your module's primary JS file to log whenever a Hook event occurs.
Hooks.once("init", function (entityType) {
    CONFIG.debug.hooks = true
    if (entityType === Token) {
        console.log("Token ", entityType.name, " selected");
    }
});

Hooks.on("ready", function () {
    console.log("This code runs once core initialization is ready and game data is available.");
});
