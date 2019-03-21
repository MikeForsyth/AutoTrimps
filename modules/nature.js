function autoNatureTokens() {
    var changed = false;
    var thresh = 0;
    if (getPageSetting('tokenthresh') > 0) {
        thresh = getPageSetting('tokenthresh');
    }
    for (var nature in game.empowerments) {
        var empowerment = game.empowerments[nature];
        var setting = getPageSetting('Auto' + nature);
        if (!setting || setting == 'Off') continue;

        if (setting == 'Empowerment') {
            var cost = getNextNatureCost(nature);
            if (empowerment.tokens < cost+thresh || empowerment.tokens < thresh)
                continue;
            empowerment.tokens -= cost;
            empowerment.level++;
            changed = true;
            debug('Upgraded Empowerment of ' + nature, 'nature');
        }
        else if (setting == 'Transfer') {
            if (empowerment.retainLevel >= 80+thresh || empowerment.tokens < thresh)
                continue;
            var cost = getNextNatureCost(nature, true);
            if (empowerment.tokens < cost) continue;
            empowerment.tokens -= cost;
            empowerment.retainLevel++;
            changed = true;
            debug('Upgraded ' + nature + ' transfer rate', 'nature');
        }
        else if (setting == 'Convert to Both') {
            if (empowerment.tokens < 20+thresh || empowerment.tokens < thresh) continue;
            for (var targetNature in game.empowerments) {
                if (targetNature == nature) continue;
                empowerment.tokens -= 10;
                var convertRate = (game.talents.nature.purchased) ? ((game.talents.nature2.purchased) ? 8 : 6) : 5;
                game.empowerments[targetNature].tokens += convertRate;
                changed = true;
                debug('Converted ' + nature + ' tokens to ' + targetNature, 'nature');
            }
        }
        else {
            if (empowerment.tokens < 10+thresh || empowerment.tokens < thresh)
                continue;
            var match = setting.match(/Convert to (\w+)/);
            var targetNature = match ? match[1] : null;
            if (!targetNature || targetNature === nature || !game.empowerments[targetNature]) continue;
            empowerment.tokens -= 10;
            var convertRate = (game.talents.nature.purchased) ? ((game.talents.nature2.purchased) ? 8 : 6) : 5;
            game.empowerments[targetNature].tokens += convertRate;
            changed = true;
            debug('Converted ' + nature + ' tokens to ' + targetNature, 'nature');
        }
    }
    if (changed)
        updateNatureInfoSpans();
}

function purchaseEnlight(nature) {
	if (game.global.uberNature == false && game.empowerments[nature].nextUberCost >= game.empowerments[nature].tokens) {
	    naturePurchase('uberEmpower', nature);
	}
}

function autoEnlight() {
	var nature = "None";
	var poison, ice, wind, dpoison, dice, dwind, cpoison, cwind, cice;

	//FILLER
	var fillernature = [];
	if (getPageSetting('pfillerenlightthresh') >= 0) {
	    poison = game.empowerments.poison.nextUberCost >= game.empowerments.poison.tokens
	}
	if (fillernature.length > 0 && game.global.challengeActive != "Daily" && !game.global.runningChallengeSquared && game.empowerments[nature].tokens >= getPageSetting('pfillerenlightthresh')) {
		if (nature != 'None') {
		    purchaseEnlight(nature);
		}
	}

	//DAILY
	if (getPageSetting('dailyenlight') != 'None' && game.global.challengeActive == "Daily" && game.empowerments[nature].tokens >= getPageSetting('dailyenlightthresh')) {
		nature = getPageSetting('dailyenlight');
		if (nature != 'None') {
		    purchaseEnlight(nature);
		}
	}

	//C2
	if (getPageSetting('c2enlight') != 'None' && game.global.runningChallengeSquared && game.empowerments[nature].tokens >= getPageSetting('c2enlightthresh')) {
		nature = getPageSetting('c2enlight');
		if (nature != 'None') {
		    purchaseEnlight(nature);
		}
	}
}