// ==UserScript==
// @name Augmentator 2
// @version 2.0
// @namespace augmentator
// @description Script to manipulate websites
// @include *
// ==/UserScript==// -----------------------------------------

var j;
var LISTS = {
	rhetoric:   { label: '---1---', color: 'cyan' },
	opinion:    { label: '---2---', color: 'lightpink' },
	sentiment:  { label: '---3---', color: 'lightgreen' },
	commentary: { label: '---4---', color: 'lightblue' },
};

// Produce html code for the augmentation selection box
function get_augbox_html() {
	var augbox_html = '<div id="augbox">\n';
	for (var key in LISTS) {
		console.log('now processing key ' + key);
		augbox_html += '<input id="aug' + key;
		augbox_html += '" type="checkbox" /><label for="aug' + key;
		augbox_html += '" style="background-color:' + LISTS[key]['color'];
		augbox_html += '">' + LISTS[key]['label'] + '</label><br />';
	}
	augbox_html += '</div>';
	return augbox_html;	
}

// Set triggers to all checkboxes
function set_triggers() {
	for (var key in LISTS) {
		j('#aug' + key).click(checkbox_clicked);
	}
}

// Process a click
function checkbox_clicked() {
	console.log('Clicked');
	for (var key in LISTS) {
		if (!j('#aug' + key).prop('checked')) {
			j('.aug' + key).replaceWith(function() { return this.innerHTML; });
			console.log('Highlighting for ' + key + ' removed.');
		}
	}
	j('p').each(process_paragraph); // Process each paragraph now
}

// Process one paragraph and highlight its words as needed
function process_paragraph(index) {
	
	// Get HTML content and split on whitespaces
	var html         = j(this).html(); // Html code in this paragraph
	var tokens       = html.split(/\s*[\s,]\s*/); // Tokens in this paragraph
	var replace_html = '';
	var replacements = 0;
	
	// Find out which checkboxes are active
	var active = {}
	for (var key in LISTS) {
		// For each dictionary key find it the checkbox is active
		active[key] = j('#aug' + key).prop('checked');
		if (index == 0) // Can this be also non-zero?
			console.log('Checkbox ' + key + ' is ' + active[key]);
	}	
	
	// Loop through all words (tokens) in this paragraph
	for (var token_i = 0; token_i < tokens.length; token_i++) {

		// If a token is in a token list, set a background color
		token = tokens[token_i];
		var colorclass = '';
		for (var key in LISTS) {
			words = LISTS[key]['words']; // Get dictionary
			// If this key is active and token is in word list, set color
			if (active[key] && j.inArray(token, words) >= 0)
				colorclass = 'aug' + key;
		}

		// If there was a match, assign a background color
		if (colorclass) {
			replace_html += '<span class="' + colorclass;
			replace_html += '">' + token + '</span> ';
			replacements++;
		} else {
			replace_html += token + ' ';
		}
	}
	
	// Insert the highlighted content into html
	if (replacements > 0) j(this).html(replace_html);
	
}

// Main program
function main() {

	// Get a jQuery object that does not conflict with another object
	j = jQuery.noConflict();
	
	// When document is ready, initialize the UI
	j(document).ready(function() {

		// Create the UI box 
		var augbox_html = get_augbox_html();
		j('body').append(augbox_html);
		set_triggers();
		
		// Set augbox properties
		j('#augbox').css('background-color', 'gray');
		j('#augbox').css('width',    '120px');
		j('#augbox').css('height',   '150px');
		j('#augbox').css('position', 'fixed');
		j('#augbox').css('right',    '0px');
		j('#augbox').css('top',      '50px');
		j('#augbox').css('opacity',  '0.6');
		j('#augbox').css('padding',  '5px');
		
		// Set color classes
		style_html = '<style>\n';
		for (var key in LISTS) {
			style_html += '.aug' + key + ' { background-color: ';
			style_html += LISTS[key]['color'] + '; }\n';
		}
		style_html += '</style>\n';
		j('head').append(style_html);
		
		// Success
		console.log('Done');
	});
}

// Rhetoric words
LISTS['rhetoric']['words'] = ['but', 'however', 'though', 'despite', 'spite',
'while', 'although', 'finally', 'instead', 'contrary', 'nevertheless',
'therefore', 'hence', 'thus', 'significant', 'because', 'since', 'whether'];

// Opinion words
LISTS['opinion']['words'] = ['good', 'much', 'more', 'most', 'better', 'best',
'increase', 'decrease', 'increasing', 'decreasing', 'fast', 'faster', 'fastest',
'traditional', 'non-traditional', 'nontraditional', 'large', 'larger', 
'largest', 'mostly', 'usually', 'high', 'higher', 'highest', 'low', 'lower',
'lowest', 'abundant', 'extremely', 'very', 'poor'];

// Commentary words
LISTS['commentary']['words'] = ['expectation', 'expect', 'expects', 'expected',
'conform', 'conforms', 'conforming', 'often', 'always', 'never', 'sometimes',
'surprise', 'surprisingly', 'surprised', 'surprising', 'result', 'resulted',
'resulting', 'effect', 'effects', 'results', 'correlation', 'correlated',
'typically', 'typical', 'normal', 'nominal', 'some', 'known', 'sugggested',
'suggest', 'suggests', 'suggesting', 'imply', 'implies', 'implying',
'report', 'reported', 'related', 'especially', 'conduct', 'conducted',
'conclude', 'concluded', 'concludes', 'published', 'normally', 'poorly',
'controversial', 'controversially', 'controversy', 'conflict', 'conflicting',
'p-value', 'maybe', 'perhaps', 'effective'];

// Sentiment words
/* 
Word lists from https://github.com/xissy/node-opinion-lexicon/
Lists introduced in this article:
Hu, M. & Liu, B. (2004). Mining and Summarizing Customer Reviews. Proceedings of KDD'04, 168-177.
*/
var NEGATIVE_WORDS = [':(', ';_;', 'T_T', '=(', ':*(', ')-:', ':-(', ':<', ')*:',
 '2-faced', '2-faces', 'abnormal', 'abolish', 'abominable', 'abominably', 
'abominate', 'abomination', 'abort', 'aborted', 'aborts', 'abrade', 
'abrasive', 'abrupt', 'abruptly', 'abscond', 'absence', 'absent-minded', 
'absentee', 'absurd', 'absurdity', 'absurdly', 'absurdness', 'abuse', 
'abused', 'abuses', 'abusive', 'abysmal', 'abysmally', 'abyss', 'accidental'
, 'accost', 'accursed', 'accusation', 'accusations', 'accuse', 'accuses', 
'accusing', 'accusingly', 'acerbate', 'acerbic', 'acerbically', 'ache', 
'ached', 'aches', 'achey', 'aching', 'acrid', 'acridly', 'acridness', 
'acrimonious', 'acrimoniously', 'acrimony', 'adamant', 'adamantly', 'addict'
, 'addicted', 'addicting', 'addicts', 'admonish', 'admonisher', 
'admonishingly', 'admonishment', 'admonition', 'adulterate', 'adulterated', 
'adulteration', 'adulterier', 'adversarial', 'adversary', 'adverse', 
'adversity', 'afflict', 'affliction', 'afflictive', 'affront', 'afraid', 
'aggravate', 'aggravating', 'aggravation', 'aggression', 'aggressive', 
'aggressiveness', 'aggressor', 'aggrieve', 'aggrieved', 'aggrivation', 
'aghast', 'agonies', 'agonize', 'agonizing', 'agonizingly', 'agony', 
'aground', 'ail', 'ailing', 'ailment', 'aimless', 'alarm', 'alarmed', 
'alarming', 'alarmingly', 'alienate', 'alienated', 'alienation', 
'allegation', 'allegations', 'allege', 'allergic', 'allergies', 'allergy', 
'aloof', 'altercation', 'ambiguity', 'ambiguous', 'ambivalence', 
'ambivalent', 'ambush', 'amiss', 'amputate', 'anarchism', 'anarchist', 
'anarchistic', 'anarchy', 'anemic', 'anger', 'angrily', 'angriness', 'angry'
, 'anguish', 'animosity', 'annihilate', 'annihilation', 'annoy', 'annoyance'
, 'annoyances', 'annoyed', 'annoying', 'annoyingly', 'annoys', 'anomalous', 
'anomaly', 'antagonism', 'antagonist', 'antagonistic', 'antagonize', 'anti-'
, 'anti-american', 'anti-israeli', 'anti-occupation', 'anti-proliferation', 
'anti-semites', 'anti-social', 'anti-us', 'anti-white', 'antipathy', 
'antiquated', 'antithetical', 'anxieties', 'anxiety', 'anxious', 'anxiously'
, 'anxiousness', 'apathetic', 'apathetically', 'apathy', 'apocalypse', 
'apocalyptic', 'apologist', 'apologists', 'appal', 'appall', 'appalled', 
'appalling', 'appallingly', 'apprehension', 'apprehensions', 'apprehensive',
 'apprehensively', 'arbitrary', 'arcane', 'archaic', 'arduous', 'arduously',
 'argumentative', 'arrogance', 'arrogant', 'arrogantly', 'ashamed', 
'asinine', 'asininely', 'asinininity', 'askance', 'asperse', 'aspersion', 
'aspersions', 'assail', 'assassin', 'assassinate', 'assault', 'assult', 
'astray', 'asunder', 'atrocious', 'atrocities', 'atrocity', 'atrophy', 
'attack', 'attacks', 'audacious', 'audaciously', 'audaciousness', 'audacity'
, 'audiciously', 'austere', 'authoritarian', 'autocrat', 'autocratic', 
'avalanche', 'avarice', 'avaricious', 'avariciously', 'avenge', 'averse', 
'aversion', 'aweful', 'awful', 'awfully', 'awfulness', 'awkward', 
'awkwardness', 'ax', 'babble', 'back-logged', 'back-wood', 'back-woods', 
'backache', 'backaches', 'backaching', 'backbite', 'backbiting', 'backward',
 'backwardness', 'backwood', 'backwoods', 'bad', 'badly', 'baffle', 
'baffled', 'bafflement', 'baffling', 'bait', 'balk', 'banal', 'banalize', 
'bane', 'banish', 'banishment', 'bankrupt', 'barbarian', 'barbaric', 
'barbarically', 'barbarity', 'barbarous', 'barbarously', 'barren', 
'baseless', 'bash', 'bashed', 'bashful', 'bashing', 'bastard', 'bastards', 
'battered', 'battering', 'batty', 'bearish', 'beastly', 'bedlam', 
'bedlamite', 'befoul', 'beg', 'beggar', 'beggarly', 'begging', 'beguile', 
'belabor', 'belated', 'beleaguer', 'belie', 'belittle', 'belittled', 
'belittling', 'bellicose', 'belligerence', 'belligerent', 'belligerently', 
'bemoan', 'bemoaning', 'bemused', 'bent', 'berate', 'bereave', 'bereavement'
, 'bereft', 'berserk', 'beseech', 'beset', 'besiege', 'besmirch', 'bestial',
 'betray', 'betrayal', 'betrayals', 'betrayer', 'betraying', 'betrays', 
'bewail', 'beware', 'bewilder', 'bewildered', 'bewildering', 'bewilderingly'
, 'bewilderment', 'bewitch', 'bias', 'biased', 'biases', 'bicker', 
'bickering', 'bid-rigging', 'bigotries', 'bigotry', 'bitch', 'bitchy', 
'biting', 'bitingly', 'bitter', 'bitterly', 'bitterness', 'bizarre', 'blab',
 'blabber', 'blackmail', 'blah', 'blame', 'blameworthy', 'bland', 'blandish'
, 'blaspheme', 'blasphemous', 'blasphemy', 'blasted', 'blatant', 'blatantly'
, 'blather', 'bleak', 'bleakly', 'bleakness', 'bleed', 'bleeding', 'bleeds',
 'blemish', 'blind', 'blinding', 'blindingly', 'blindside', 'blister', 
'blistering', 'bloated', 'blockage', 'blockhead', 'bloodshed', 
'bloodthirsty', 'bloody', 'blotchy', 'blow', 'blunder', 'blundering', 
'blunders', 'blunt', 'blur', 'bluring', 'blurred', 'blurring', 'blurry', 
'blurs', 'blurt', 'boastful', 'boggle', 'bogus', 'boil', 'boiling', 
'boisterous', 'bomb', 'bombard', 'bombardment', 'bombastic', 'bondage', 
'bonkers', 'bore', 'bored', 'boredom', 'bores', 'boring', 'botch', 'bother',
 'bothered', 'bothering', 'bothers', 'bothersome', 'bowdlerize', 'boycott', 
'braggart', 'bragger', 'brainless', 'brainwash', 'brash', 'brashly', 
'brashness', 'brat', 'bravado', 'brazen', 'brazenly', 'brazenness', 'breach'
, 'break', 'break-up', 'break-ups', 'breakdown', 'breaking', 'breaks', 
'breakup', 'breakups', 'bribery', 'brimstone', 'bristle', 'brittle', 'broke'
, 'broken', 'broken-hearted', 'brood', 'browbeat', 'bruise', 'bruised', 
'bruises', 'bruising', 'brusque', 'brutal', 'brutalising', 'brutalities', 
'brutality', 'brutalize', 'brutalizing', 'brutally', 'brute', 'brutish', 
'bs', 'buckle', 'bug', 'bugging', 'buggy', 'bugs', 'bulkier', 'bulkiness', 
'bulky', 'bulkyness', 'bull****', 'bull----', 'bullies', 'bullshit', 
'bullshyt', 'bully', 'bullying', 'bullyingly', 'bum', 'bump', 'bumped', 
'bumping', 'bumpping', 'bumps', 'bumpy', 'bungle', 'bungler', 'bungling', 
'bunk', 'burden', 'burdensome', 'burdensomely', 'burn', 'burned', 'burning',
 'burns', 'bust', 'busts', 'busybody', 'butcher', 'butchery', 'buzzing', 
'byzantine', 'cackle', 'calamities', 'calamitous', 'calamitously', 
'calamity', 'callous', 'calumniate', 'calumniation', 'calumnies', 
'calumnious', 'calumniously', 'calumny', 'cancer', 'cancerous', 'cannibal', 
'cannibalize', 'capitulate', 'capricious', 'capriciously', 'capriciousness',
 'capsize', 'careless', 'carelessness', 'caricature', 'carnage', 'carp', 
'cartoonish', 'cash-strapped', 'castigate', 'castrated', 'casualty', 
'cataclysm', 'cataclysmal', 'cataclysmic', 'cataclysmically', 'catastrophe',
 'catastrophes', 'catastrophic', 'catastrophically', 'catastrophies', 
'caustic', 'caustically', 'cautionary', 'cave', 'censure', 'chafe', 'chaff',
 'chagrin', 'challenging', 'chaos', 'chaotic', 'chasten', 'chastise', 
'chastisement', 'chatter', 'chatterbox', 'cheap', 'cheapen', 'cheaply', 
'cheat', 'cheated', 'cheater', 'cheating', 'cheats', 'checkered', 
'cheerless', 'cheesy', 'chide', 'childish', 'chill', 'chilly', 'chintzy', 
'choke', 'choleric', 'choppy', 'chore', 'chronic', 'chunky', 'clamor', 
'clamorous', 'clash', 'cliche', 'cliched', 'clique', 'clog', 'clogged', 
'clogs', 'cloud', 'clouding', 'cloudy', 'clueless', 'clumsy', 'clunky', 
'coarse', 'cocky', 'coerce', 'coercion', 'coercive', 'cold', 'coldly', 
'collapse', 'collude', 'collusion', 'combative', 'combust', 'comical', 
'commiserate', 'commonplace', 'commotion', 'commotions', 'complacent', 
'complain', 'complained', 'complaining', 'complains', 'complaint', 
'complaints', 'complex', 'complicated', 'complication', 'complicit', 
'compulsion', 'compulsive', 'concede', 'conceded', 'conceit', 'conceited', 
'concen', 'concens', 'concern', 'concerned', 'concerns', 'concession', 
'concessions', 'condemn', 'condemnable', 'condemnation', 'condemned', 
'condemns', 'condescend', 'condescending', 'condescendingly', 
'condescension', 'confess', 'confession', 'confessions', 'confined', 
'conflict', 'conflicted', 'conflicting', 'conflicts', 'confound', 
'confounded', 'confounding', 'confront', 'confrontation', 'confrontational',
 'confuse', 'confused', 'confuses', 'confusing', 'confusion', 'confusions', 
'congested', 'congestion', 'cons', 'conscons', 'conservative', 'conspicuous'
, 'conspicuously', 'conspiracies', 'conspiracy', 'conspirator', 
'conspiratorial', 'conspire', 'consternation', 'contagious', 'contaminate', 
'contaminated', 'contaminates', 'contaminating', 'contamination', 'contempt'
, 'contemptible', 'contemptuous', 'contemptuously', 'contend', 'contention',
 'contentious', 'contort', 'contortions', 'contradict', 'contradiction', 
'contradictory', 'contrariness', 'contravene', 'contrive', 'contrived', 
'controversial', 'controversy', 'convoluted', 'corrode', 'corrosion', 
'corrosions', 'corrosive', 'corrupt', 'corrupted', 'corrupting', 
'corruption', 'corrupts', 'corruptted', 'costlier', 'costly', 
'counter-productive', 'counterproductive', 'coupists', 'covetous', 'coward',
 'cowardly', 'crabby', 'crack', 'cracked', 'cracks', 'craftily', 'craftly', 
'crafty', 'cramp', 'cramped', 'cramping', 'cranky', 'crap', 'crappy', 
'craps', 'crash', 'crashed', 'crashes', 'crashing', 'crass', 'craven', 
'cravenly', 'craze', 'crazily', 'craziness', 'crazy', 'creak', 'creaking', 
'creaks', 'credulous', 'creep', 'creeping', 'creeps', 'creepy', 'crept', 
'crime', 'criminal', 'cringe', 'cringed', 'cringes', 'cripple', 'crippled', 
'cripples', 'crippling', 'crisis', 'critic', 'critical', 'criticism', 
'criticisms', 'criticize', 'criticized', 'criticizing', 'critics', 
'cronyism', 'crook', 'crooked', 'crooks', 'crowded', 'crowdedness', 'crude',
 'cruel', 'crueler', 'cruelest', 'cruelly', 'cruelness', 'cruelties', 
'cruelty', 'crumble', 'crumbling', 'crummy', 'crumple', 'crumpled', 
'crumples', 'crush', 'crushed', 'crushing', 'cry', 'culpable', 'culprit', 
'cumbersome', 'cunt', 'cunts', 'cuplrit', 'curse', 'cursed', 'curses', 
'curt', 'cuss', 'cussed', 'cutthroat', 'cynical', 'cynicism', 'd*mn', 
'damage', 'damaged', 'damages', 'damaging', 'damn', 'damnable', 'damnably', 
'damnation', 'damned', 'damning', 'damper', 'danger', 'dangerous', 
'dangerousness', 'dark', 'darken', 'darkened', 'darker', 'darkness', 
'dastard', 'dastardly', 'daunt', 'daunting', 'dauntingly', 'dawdle', 'daze',
 'dazed', 'dead', 'deadbeat', 'deadlock', 'deadly', 'deadweight', 'deaf', 
'dearth', 'death', 'debacle', 'debase', 'debasement', 'debaser', 'debatable'
, 'debauch', 'debaucher', 'debauchery', 'debilitate', 'debilitating', 
'debility', 'debt', 'debts', 'decadence', 'decadent', 'decay', 'decayed', 
'deceit', 'deceitful', 'deceitfully', 'deceitfulness', 'deceive', 'deceiver'
, 'deceivers', 'deceiving', 'deception', 'deceptive', 'deceptively', 
'declaim', 'decline', 'declines', 'declining', 'decrement', 'decrepit', 
'decrepitude', 'decry', 'defamation', 'defamations', 'defamatory', 'defame',
 'defect', 'defective', 'defects', 'defensive', 'defiance', 'defiant', 
'defiantly', 'deficiencies', 'deficiency', 'deficient', 'defile', 'defiler',
 'deform', 'deformed', 'defrauding', 'defunct', 'defy', 'degenerate', 
'degenerately', 'degeneration', 'degradation', 'degrade', 'degrading', 
'degradingly', 'dehumanization', 'dehumanize', 'deign', 'deject', 'dejected'
, 'dejectedly', 'dejection', 'delay', 'delayed', 'delaying', 'delays', 
'delinquency', 'delinquent', 'delirious', 'delirium', 'delude', 'deluded', 
'deluge', 'delusion', 'delusional', 'delusions', 'demean', 'demeaning', 
'demise', 'demolish', 'demolisher', 'demon', 'demonic', 'demonize', 
'demonized', 'demonizes', 'demonizing', 'demoralize', 'demoralizing', 
'demoralizingly', 'denial', 'denied', 'denies', 'denigrate', 'denounce', 
'dense', 'dent', 'dented', 'dents', 'denunciate', 'denunciation', 
'denunciations', 'deny', 'denying', 'deplete', 'deplorable', 'deplorably', 
'deplore', 'deploring', 'deploringly', 'deprave', 'depraved', 'depravedly', 
'deprecate', 'depress', 'depressed', 'depressing', 'depressingly', 
'depression', 'depressions', 'deprive', 'deprived', 'deride', 'derision', 
'derisive', 'derisively', 'derisiveness', 'derogatory', 'desecrate', 
'desert', 'desertion', 'desiccate', 'desiccated', 'desititute', 'desolate', 
'desolately', 'desolation', 'despair', 'despairing', 'despairingly', 
'desperate', 'desperately', 'desperation', 'despicable', 'despicably', 
'despise', 'despised', 'despoil', 'despoiler', 'despondence', 'despondency',
 'despondent', 'despondently', 'despot', 'despotic', 'despotism', 
'destabilisation', 'destains', 'destitute', 'destitution', 'destroy', 
'destroyer', 'destruction', 'destructive', 'desultory', 'deter', 
'deteriorate', 'deteriorating', 'deterioration', 'deterrent', 'detest', 
'detestable', 'detestably', 'detested', 'detesting', 'detests', 'detract', 
'detracted', 'detracting', 'detraction', 'detracts', 'detriment', 
'detrimental', 'devastate', 'devastated', 'devastates', 'devastating', 
'devastatingly', 'devastation', 'deviate', 'deviation', 'devil', 'devilish',
 'devilishly', 'devilment', 'devilry', 'devious', 'deviously', 'deviousness'
, 'devoid', 'diabolic', 'diabolical', 'diabolically', 'diametrically', 
'diappointed', 'diatribe', 'diatribes', 'dick', 'dictator', 'dictatorial', 
'die', 'die-hard', 'died', 'dies', 'difficult', 'difficulties', 'difficulty'
, 'diffidence', 'dilapidated', 'dilemma', 'dilly-dally', 'dim', 'dimmer', 
'din', 'ding', 'dings', 'dinky', 'dire', 'direly', 'direness', 'dirt', 
'dirtbag', 'dirtbags', 'dirts', 'dirty', 'disable', 'disabled', 'disaccord',
 'disadvantage', 'disadvantaged', 'disadvantageous', 'disadvantages', 
'disaffect', 'disaffected', 'disaffirm', 'disagree', 'disagreeable', 
'disagreeably', 'disagreed', 'disagreeing', 'disagreement', 'disagrees', 
'disallow', 'disapointed', 'disapointing', 'disapointment', 'disappoint', 
'disappointed', 'disappointing', 'disappointingly', 'disappointment', 
'disappointments', 'disappoints', 'disapprobation', 'disapproval', 
'disapprove', 'disapproving', 'disarm', 'disarray', 'disaster', 
'disasterous', 'disastrous', 'disastrously', 'disavow', 'disavowal', 
'disbelief', 'disbelieve', 'disbeliever', 'disclaim', 'discombobulate', 
'discomfit', 'discomfititure', 'discomfort', 'discompose', 'disconcert', 
'disconcerted', 'disconcerting', 'disconcertingly', 'disconsolate', 
'disconsolately', 'disconsolation', 'discontent', 'discontented', 
'discontentedly', 'discontinued', 'discontinuity', 'discontinuous', 
'discord', 'discordance', 'discordant', 'discountenance', 'discourage', 
'discouragement', 'discouraging', 'discouragingly', 'discourteous', 
'discourteously', 'discoutinous', 'discredit', 'discrepant', 'discriminate',
 'discrimination', 'discriminatory', 'disdain', 'disdained', 'disdainful', 
'disdainfully', 'disfavor', 'disgrace', 'disgraced', 'disgraceful', 
'disgracefully', 'disgruntle', 'disgruntled', 'disgust', 'disgusted', 
'disgustedly', 'disgustful', 'disgustfully', 'disgusting', 'disgustingly', 
'dishearten', 'disheartening', 'dishearteningly', 'dishonest', 'dishonestly'
, 'dishonesty', 'dishonor', 'dishonorable', 'dishonorablely', 'disillusion',
 'disillusioned', 'disillusionment', 'disillusions', 'disinclination', 
'disinclined', 'disingenuous', 'disingenuously', 'disintegrate', 
'disintegrated', 'disintegrates', 'disintegration', 'disinterest', 
'disinterested', 'dislike', 'disliked', 'dislikes', 'disliking', 
'dislocated', 'disloyal', 'disloyalty', 'dismal', 'dismally', 'dismalness', 
'dismay', 'dismayed', 'dismaying', 'dismayingly', 'dismissive', 
'dismissively', 'disobedience', 'disobedient', 'disobey', 'disoobedient', 
'disorder', 'disordered', 'disorderly', 'disorganized', 'disorient', 
'disoriented', 'disown', 'disparage', 'disparaging', 'disparagingly', 
'dispensable', 'dispirit', 'dispirited', 'dispiritedly', 'dispiriting', 
'displace', 'displaced', 'displease', 'displeased', 'displeasing', 
'displeasure', 'disproportionate', 'disprove', 'disputable', 'dispute', 
'disputed', 'disquiet', 'disquieting', 'disquietingly', 'disquietude', 
'disregard', 'disregardful', 'disreputable', 'disrepute', 'disrespect', 
'disrespectable', 'disrespectablity', 'disrespectful', 'disrespectfully', 
'disrespectfulness', 'disrespecting', 'disrupt', 'disruption', 'disruptive',
 'diss', 'dissapointed', 'dissappointed', 'dissappointing', 
'dissatisfaction', 'dissatisfactory', 'dissatisfied', 'dissatisfies', 
'dissatisfy', 'dissatisfying', 'dissed', 'dissemble', 'dissembler', 
'dissension', 'dissent', 'dissenter', 'dissention', 'disservice', 'disses', 
'dissidence', 'dissident', 'dissidents', 'dissing', 'dissocial', 'dissolute'
, 'dissolution', 'dissonance', 'dissonant', 'dissonantly', 'dissuade', 
'dissuasive', 'distains', 'distaste', 'distasteful', 'distastefully', 
'distort', 'distorted', 'distortion', 'distorts', 'distract', 'distracting',
 'distraction', 'distraught', 'distraughtly', 'distraughtness', 'distress', 
'distressed', 'distressing', 'distressingly', 'distrust', 'distrustful', 
'distrusting', 'disturb', 'disturbance', 'disturbed', 'disturbing', 
'disturbingly', 'disunity', 'disvalue', 'divergent', 'divisive', 
'divisively', 'divisiveness', 'dizzing', 'dizzingly', 'dizzy', 'doddering', 
'dodgey', 'dogged', 'doggedly', 'dogmatic', 'doldrums', 'domineer', 
'domineering', 'donside', 'doom', 'doomed', 'doomsday', 'dope', 'doubt', 
'doubtful', 'doubtfully', 'doubts', 'douchbag', 'douchebag', 'douchebags', 
'downbeat', 'downcast', 'downer', 'downfall', 'downfallen', 'downgrade', 
'downhearted', 'downheartedly', 'downhill', 'downside', 'downsides', 
'downturn', 'downturns', 'drab', 'draconian', 'draconic', 'drag', 'dragged',
 'dragging', 'dragoon', 'drags', 'drain', 'drained', 'draining', 'drains', 
'drastic', 'drastically', 'drawback', 'drawbacks', 'dread', 'dreadful', 
'dreadfully', 'dreadfulness', 'dreary', 'dripped', 'dripping', 'drippy', 
'drips', 'drones', 'droop', 'droops', 'drop-out', 'drop-outs', 'dropout', 
'dropouts', 'drought', 'drowning', 'drunk', 'drunkard', 'drunken', 'dubious'
, 'dubiously', 'dubitable', 'dud', 'dull', 'dullard', 'dumb', 'dumbfound', 
'dump', 'dumped', 'dumping', 'dumps', 'dunce', 'dungeon', 'dungeons', 'dupe'
, 'dust', 'dusty', 'dwindling', 'dying', 'earsplitting', 'eccentric', 
'eccentricity', 'effigy', 'effrontery', 'egocentric', 'egomania', 'egotism',
 'egotistical', 'egotistically', 'egregious', 'egregiously', 
'election-rigger', 'elimination', 'emaciated', 'emasculate', 'embarrass', 
'embarrassing', 'embarrassingly', 'embarrassment', 'embattled', 'embroil', 
'embroiled', 'embroilment', 'emergency', 'emphatic', 'emphatically', 
'emptiness', 'encroach', 'encroachment', 'endanger', 'enemies', 'enemy', 
'enervate', 'enfeeble', 'enflame', 'engulf', 'enjoin', 'enmity', 'enrage', 
'enraged', 'enraging', 'enslave', 'entangle', 'entanglement', 'entrap', 
'entrapment', 'envious', 'enviously', 'enviousness', 'epidemic', 'equivocal'
, 'erase', 'erode', 'erodes', 'erosion', 'err', 'errant', 'erratic', 
'erratically', 'erroneous', 'erroneously', 'error', 'errors', 'eruptions', 
'escapade', 'eschew', 'estranged', 'evade', 'evasion', 'evasive', 'evil', 
'evildoer', 'evils', 'eviscerate', 'exacerbate', 'exagerate', 'exagerated', 
'exagerates', 'exaggerate', 'exaggeration', 'exasperate', 'exasperated', 
'exasperating', 'exasperatingly', 'exasperation', 'excessive', 'excessively'
, 'exclusion', 'excoriate', 'excruciating', 'excruciatingly', 'excuse', 
'excuses', 'execrate', 'exhaust', 'exhausted', 'exhaustion', 'exhausts', 
'exhorbitant', 'exhort', 'exile', 'exorbitant', 'exorbitantance', 
'exorbitantly', 'expel', 'expensive', 'expire', 'expired', 'explode', 
'exploit', 'exploitation', 'explosive', 'expropriate', 'expropriation', 
'expulse', 'expunge', 'exterminate', 'extermination', 'extinguish', 'extort'
, 'extortion', 'extraneous', 'extravagance', 'extravagant', 'extravagantly',
 'extremism', 'extremist', 'extremists', 'eyesore', 'f**k', 'fabricate', 
'fabrication', 'facetious', 'facetiously', 'fail', 'failed', 'failing', 
'fails', 'failure', 'failures', 'faint', 'fainthearted', 'faithless', 'fake'
, 'fall', 'fallacies', 'fallacious', 'fallaciously', 'fallaciousness', 
'fallacy', 'fallen', 'falling', 'fallout', 'falls', 'false', 'falsehood', 
'falsely', 'falsify', 'falter', 'faltered', 'famine', 'famished', 'fanatic',
 'fanatical', 'fanatically', 'fanaticism', 'fanatics', 'fanciful', 
'far-fetched', 'farce', 'farcical', 'farcical-yet-provocative', 'farcically'
, 'farfetched', 'fascism', 'fascist', 'fastidious', 'fastidiously', 
'fastuous', 'fat', 'fat-cat', 'fat-cats', 'fatal', 'fatalistic', 
'fatalistically', 'fatally', 'fatcat', 'fatcats', 'fateful', 'fatefully', 
'fathomless', 'fatigue', 'fatigued', 'fatique', 'fatty', 'fatuity', 
'fatuous', 'fatuously', 'fault', 'faults', 'faulty', 'fawningly', 'faze', 
'fear', 'fearful', 'fearfully', 'fears', 'fearsome', 'feckless', 'feeble', 
'feeblely', 'feebleminded', 'feign', 'feint', 'fell', 'felon', 'felonious', 
'ferociously', 'ferocity', 'fetid', 'fever', 'feverish', 'fevers', 'fiasco',
 'fib', 'fibber', 'fickle', 'fiction', 'fictional', 'fictitious', 'fidget', 
'fidgety', 'fiend', 'fiendish', 'fierce', 'figurehead', 'filth', 'filthy', 
'finagle', 'finicky', 'fissures', 'fist', 'flabbergast', 'flabbergasted', 
'flagging', 'flagrant', 'flagrantly', 'flair', 'flairs', 'flak', 'flake', 
'flakey', 'flakieness', 'flaking', 'flaky', 'flare', 'flares', 'flareup', 
'flareups', 'flat-out', 'flaunt', 'flaw', 'flawed', 'flaws', 'flee', 'fleed'
, 'fleeing', 'fleer', 'flees', 'fleeting', 'flicering', 'flicker', 
'flickering', 'flickers', 'flighty', 'flimflam', 'flimsy', 'flirt', 'flirty'
, 'floored', 'flounder', 'floundering', 'flout', 'fluster', 'foe', 'fool', 
'fooled', 'foolhardy', 'foolish', 'foolishly', 'foolishness', 'forbid', 
'forbidden', 'forbidding', 'forceful', 'foreboding', 'forebodingly', 
'forfeit', 'forged', 'forgetful', 'forgetfully', 'forgetfulness', 'forlorn',
 'forlornly', 'forsake', 'forsaken', 'forswear', 'foul', 'foully', 
'foulness', 'fractious', 'fractiously', 'fracture', 'fragile', 'fragmented',
 'frail', 'frantic', 'frantically', 'franticly', 'fraud', 'fraudulent', 
'fraught', 'frazzle', 'frazzled', 'freak', 'freaking', 'freakish', 
'freakishly', 'freaks', 'freeze', 'freezes', 'freezing', 'frenetic', 
'frenetically', 'frenzied', 'frenzy', 'fret', 'fretful', 'frets', 'friction'
, 'frictions', 'fried', 'friggin', 'frigging', 'fright', 'frighten', 
'frightening', 'frighteningly', 'frightful', 'frightfully', 'frigid', 
'frost', 'frown', 'froze', 'frozen', 'fruitless', 'fruitlessly', 'frustrate'
, 'frustrated', 'frustrates', 'frustrating', 'frustratingly', 'frustration',
 'frustrations', 'fuck', 'fucking', 'fudge', 'fugitive', 'full-blown', 
'fulminate', 'fumble', 'fume', 'fumes', 'fundamentalism', 'funky', 'funnily'
, 'funny', 'furious', 'furiously', 'furor', 'fury', 'fuss', 'fussy', 
'fustigate', 'fusty', 'futile', 'futilely', 'futility', 'fuzzy', 'gabble', 
'gaff', 'gaffe', 'gainsay', 'gainsayer', 'gall', 'galling', 'gallingly', 
'galls', 'gangster', 'gape', 'garbage', 'garish', 'gasp', 'gauche', 'gaudy',
 'gawk', 'gawky', 'geezer', 'genocide', 'get-rich', 'ghastly', 'ghetto', 
'ghosting', 'gibber', 'gibberish', 'gibe', 'giddy', 'gimmick', 'gimmicked', 
'gimmicking', 'gimmicks', 'gimmicky', 'glare', 'glaringly', 'glib', 'glibly'
, 'glitch', 'glitches', 'gloatingly', 'gloom', 'gloomy', 'glower', 'glum', 
'glut', 'gnawing', 'goad', 'goading', 'god-awful', 'goof', 'goofy', 'goon', 
'gossip', 'graceless', 'gracelessly', 'graft', 'grainy', 'grapple', 'grate',
 'grating', 'gravely', 'greasy', 'greed', 'greedy', 'grief', 'grievance', 
'grievances', 'grieve', 'grieving', 'grievous', 'grievously', 'grim', 
'grimace', 'grind', 'gripe', 'gripes', 'grisly', 'gritty', 'gross', 
'grossly', 'grotesque', 'grouch', 'grouchy', 'groundless', 'grouse', 'growl'
, 'grudge', 'grudges', 'grudging', 'grudgingly', 'gruesome', 'gruesomely', 
'gruff', 'grumble', 'grumpier', 'grumpiest', 'grumpily', 'grumpish', 
'grumpy', 'guile', 'guilt', 'guiltily', 'guilty', 'gullible', 'gutless', 
'gutter', 'hack', 'hacks', 'haggard', 'haggle', 'hairloss', 'halfhearted', 
'halfheartedly', 'hallucinate', 'hallucination', 'hamper', 'hampered', 
'handicapped', 'hang', 'hangs', 'haphazard', 'hapless', 'harangue', 'harass'
, 'harassed', 'harasses', 'harassment', 'harboring', 'harbors', 'hard', 
'hard-hit', 'hard-line', 'hard-liner', 'hardball', 'harden', 'hardened', 
'hardheaded', 'hardhearted', 'hardliner', 'hardliners', 'hardship', 
'hardships', 'harm', 'harmed', 'harmful', 'harms', 'harpy', 'harridan', 
'harried', 'harrow', 'harsh', 'harshly', 'hasseling', 'hassle', 'hassled', 
'hassles', 'haste', 'hastily', 'hasty', 'hate', 'hated', 'hateful', 
'hatefully', 'hatefulness', 'hater', 'haters', 'hates', 'hating', 'hatred', 
'haughtily', 'haughty', 'haunt', 'haunting', 'havoc', 'hawkish', 'haywire', 
'hazard', 'hazardous', 'haze', 'hazy', 'head-aches', 'headache', 'headaches'
, 'heartbreaker', 'heartbreaking', 'heartbreakingly', 'heartless', 'heathen'
, 'heavy-handed', 'heavyhearted', 'heck', 'heckle', 'heckled', 'heckles', 
'hectic', 'hedge', 'hedonistic', 'heedless', 'hefty', 'hegemonism', 
'hegemonistic', 'hegemony', 'heinous', 'hell', 'hell-bent', 'hellion', 
'hells', 'helpless', 'helplessly', 'helplessness', 'heresy', 'heretic', 
'heretical', 'hesitant', 'hestitant', 'hideous', 'hideously', 'hideousness',
 'high-priced', 'hiliarious', 'hinder', 'hindrance', 'hiss', 'hissed', 
'hissing', 'ho-hum', 'hoard', 'hoax', 'hobble', 'hogs', 'hollow', 'hoodium',
 'hoodwink', 'hooligan', 'hopeless', 'hopelessly', 'hopelessness', 'horde', 
'horrendous', 'horrendously', 'horrible', 'horrid', 'horrific', 'horrified',
 'horrifies', 'horrify', 'horrifying', 'horrifys', 'hostage', 'hostile', 
'hostilities', 'hostility', 'hotbeds', 'hothead', 'hotheaded', 'hothouse', 
'hubris', 'huckster', 'hum', 'humid', 'humiliate', 'humiliating', 
'humiliation', 'humming', 'hung', 'hurt', 'hurted', 'hurtful', 'hurting', 
'hurts', 'hustler', 'hype', 'hypocricy', 'hypocrisy', 'hypocrite', 
'hypocrites', 'hypocritical', 'hypocritically', 'hysteria', 'hysteric', 
'hysterical', 'hysterically', 'hysterics', 'idiocies', 'idiocy', 'idiot', 
'idiotic', 'idiotically', 'idiots', 'idle', 'ignoble', 'ignominious', 
'ignominiously', 'ignominy', 'ignorance', 'ignorant', 'ignore', 
'ill-advised', 'ill-conceived', 'ill-defined', 'ill-designed', 'ill-fated', 
'ill-favored', 'ill-formed', 'ill-mannered', 'ill-natured', 'ill-sorted', 
'ill-tempered', 'ill-treated', 'ill-treatment', 'ill-usage', 'ill-used', 
'illegal', 'illegally', 'illegitimate', 'illicit', 'illiterate', 'illness', 
'illogic', 'illogical', 'illogically', 'illusion', 'illusions', 'illusory', 
'imaginary', 'imbalance', 'imbecile', 'imbroglio', 'immaterial', 'immature',
 'imminence', 'imminently', 'immobilized', 'immoderate', 'immoderately', 
'immodest', 'immoral', 'immorality', 'immorally', 'immovable', 'impair', 
'impaired', 'impasse', 'impatience', 'impatient', 'impatiently', 'impeach', 
'impedance', 'impede', 'impediment', 'impending', 'impenitent', 'imperfect',
 'imperfection', 'imperfections', 'imperfectly', 'imperialist', 'imperil', 
'imperious', 'imperiously', 'impermissible', 'impersonal', 'impertinent', 
'impetuous', 'impetuously', 'impiety', 'impinge', 'impious', 'implacable', 
'implausible', 'implausibly', 'implicate', 'implication', 'implode', 
'impolite', 'impolitely', 'impolitic', 'importunate', 'importune', 'impose',
 'imposers', 'imposing', 'imposition', 'impossible', 'impossiblity', 
'impossibly', 'impotent', 'impoverish', 'impoverished', 'impractical', 
'imprecate', 'imprecise', 'imprecisely', 'imprecision', 'imprison', 
'imprisonment', 'improbability', 'improbable', 'improbably', 'improper', 
'improperly', 'impropriety', 'imprudence', 'imprudent', 'impudence', 
'impudent', 'impudently', 'impugn', 'impulsive', 'impulsively', 'impunity', 
'impure', 'impurity', 'inability', 'inaccuracies', 'inaccuracy', 
'inaccurate', 'inaccurately', 'inaction', 'inactive', 'inadequacy', 
'inadequate', 'inadequately', 'inadverent', 'inadverently', 'inadvisable', 
'inadvisably', 'inane', 'inanely', 'inappropriate', 'inappropriately', 
'inapt', 'inaptitude', 'inarticulate', 'inattentive', 'inaudible', 
'incapable', 'incapably', 'incautious', 'incendiary', 'incense', 'incessant'
, 'incessantly', 'incite', 'incitement', 'incivility', 'inclement', 
'incognizant', 'incoherence', 'incoherent', 'incoherently', 'incommensurate'
, 'incomparable', 'incomparably', 'incompatability', 'incompatibility', 
'incompatible', 'incompetence', 'incompetent', 'incompetently', 'incomplete'
, 'incompliant', 'incomprehensible', 'incomprehension', 'inconceivable', 
'inconceivably', 'incongruous', 'incongruously', 'inconsequent', 
'inconsequential', 'inconsequentially', 'inconsequently', 'inconsiderate', 
'inconsiderately', 'inconsistence', 'inconsistencies', 'inconsistency', 
'inconsistent', 'inconsolable', 'inconsolably', 'inconstant', 
'inconvenience', 'inconveniently', 'incorrect', 'incorrectly', 
'incorrigible', 'incorrigibly', 'incredulous', 'incredulously', 'inculcate',
 'indecency', 'indecent', 'indecently', 'indecision', 'indecisive', 
'indecisively', 'indecorum', 'indefensible', 'indelicate', 'indeterminable',
 'indeterminably', 'indeterminate', 'indifference', 'indifferent', 
'indigent', 'indignant', 'indignantly', 'indignation', 'indignity', 
'indiscernible', 'indiscreet', 'indiscreetly', 'indiscretion', 
'indiscriminate', 'indiscriminately', 'indiscriminating', 
'indistinguishable', 'indoctrinate', 'indoctrination', 'indolent', 'indulge'
, 'ineffective', 'ineffectively', 'ineffectiveness', 'ineffectual', 
'ineffectually', 'ineffectualness', 'inefficacious', 'inefficacy', 
'inefficiency', 'inefficient', 'inefficiently', 'inelegance', 'inelegant', 
'ineligible', 'ineloquent', 'ineloquently', 'inept', 'ineptitude', 'ineptly'
, 'inequalities', 'inequality', 'inequitable', 'inequitably', 'inequities', 
'inescapable', 'inescapably', 'inessential', 'inevitable', 'inevitably', 
'inexcusable', 'inexcusably', 'inexorable', 'inexorably', 'inexperience', 
'inexperienced', 'inexpert', 'inexpertly', 'inexpiable', 'inexplainable', 
'inextricable', 'inextricably', 'infamous', 'infamously', 'infamy', 
'infected', 'infection', 'infections', 'inferior', 'inferiority', 'infernal'
, 'infest', 'infested', 'infidel', 'infidels', 'infiltrator', 'infiltrators'
, 'infirm', 'inflame', 'inflammation', 'inflammatory', 'inflammed', 
'inflated', 'inflationary', 'inflexible', 'inflict', 'infraction', 
'infringe', 'infringement', 'infringements', 'infuriate', 'infuriated', 
'infuriating', 'infuriatingly', 'inglorious', 'ingrate', 'ingratitude', 
'inhibit', 'inhibition', 'inhospitable', 'inhospitality', 'inhuman', 
'inhumane', 'inhumanity', 'inimical', 'inimically', 'iniquitous', 'iniquity'
, 'injudicious', 'injure', 'injurious', 'injury', 'injustice', 'injustices',
 'innuendo', 'inoperable', 'inopportune', 'inordinate', 'inordinately', 
'insane', 'insanely', 'insanity', 'insatiable', 'insecure', 'insecurity', 
'insensible', 'insensitive', 'insensitively', 'insensitivity', 'insidious', 
'insidiously', 'insignificance', 'insignificant', 'insignificantly', 
'insincere', 'insincerely', 'insincerity', 'insinuate', 'insinuating', 
'insinuation', 'insociable', 'insolence', 'insolent', 'insolently', 
'insolvent', 'insouciance', 'instability', 'instable', 'instigate', 
'instigator', 'instigators', 'insubordinate', 'insubstantial', 
'insubstantially', 'insufferable', 'insufferably', 'insufficiency', 
'insufficient', 'insufficiently', 'insular', 'insult', 'insulted', 
'insulting', 'insultingly', 'insults', 'insupportable', 'insupportably', 
'insurmountable', 'insurmountably', 'insurrection', 'intefere', 'inteferes',
 'intense', 'interfere', 'interference', 'interferes', 'intermittent', 
'interrupt', 'interruption', 'interruptions', 'intimidate', 'intimidating', 
'intimidatingly', 'intimidation', 'intolerable', 'intolerablely', 
'intolerance', 'intoxicate', 'intractable', 'intransigence', 'intransigent',
 'intrude', 'intrusion', 'intrusive', 'inundate', 'inundated', 'invader', 
'invalid', 'invalidate', 'invalidity', 'invasive', 'invective', 'inveigle', 
'invidious', 'invidiously', 'invidiousness', 'invisible', 'involuntarily', 
'involuntary', 'irascible', 'irate', 'irately', 'ire', 'irk', 'irked', 
'irking', 'irks', 'irksome', 'irksomely', 'irksomeness', 'irksomenesses', 
'ironic', 'ironical', 'ironically', 'ironies', 'irony', 'irragularity', 
'irrational', 'irrationalities', 'irrationality', 'irrationally', 
'irrationals', 'irreconcilable', 'irrecoverable', 'irrecoverableness', 
'irrecoverablenesses', 'irrecoverably', 'irredeemable', 'irredeemably', 
'irreformable', 'irregular', 'irregularity', 'irrelevance', 'irrelevant', 
'irreparable', 'irreplacible', 'irrepressible', 'irresolute', 'irresolvable'
, 'irresponsible', 'irresponsibly', 'irretating', 'irretrievable', 
'irreversible', 'irritable', 'irritably', 'irritant', 'irritate', 
'irritated', 'irritating', 'irritation', 'irritations', 'isolate', 
'isolated', 'isolation', 'issue', 'issues', 'itch', 'itching', 'itchy', 
'jabber', 'jaded', 'jagged', 'jam', 'jarring', 'jaundiced', 'jealous', 
'jealously', 'jealousness', 'jealousy', 'jeer', 'jeering', 'jeeringly', 
'jeers', 'jeopardize', 'jeopardy', 'jerk', 'jerky', 'jitter', 'jitters', 
'jittery', 'job-killing', 'jobless', 'joke', 'joker', 'jolt', 'judder', 
'juddering', 'judders', 'jumpy', 'junk', 'junky', 'junkyard', 'jutter', 
'jutters', 'kaput', 'kill', 'killed', 'killer', 'killing', 'killjoy', 
'kills', 'knave', 'knife', 'knock', 'knotted', 'kook', 'kooky', 'lack', 
'lackadaisical', 'lacked', 'lackey', 'lackeys', 'lacking', 'lackluster', 
'lacks', 'laconic', 'lag', 'lagged', 'lagging', 'laggy', 'lags', 'laid-off',
 'lambast', 'lambaste', 'lame', 'lame-duck', 'lament', 'lamentable', 
'lamentably', 'languid', 'languish', 'languor', 'languorous', 'languorously'
, 'lanky', 'lapse', 'lapsed', 'lapses', 'lascivious', 'last-ditch', 
'latency', 'laughable', 'laughably', 'laughingstock', 'lawbreaker', 
'lawbreaking', 'lawless', 'lawlessness', 'layoff', 'layoff-happy', 'lazy', 
'leak', 'leakage', 'leakages', 'leaking', 'leaks', 'leaky', 'lech', 'lecher'
, 'lecherous', 'lechery', 'leech', 'leer', 'leery', 'left-leaning', 'lemon',
 'lengthy', 'less-developed', 'lesser-known', 'letch', 'lethal', 'lethargic'
, 'lethargy', 'lewd', 'lewdly', 'lewdness', 'liability', 'liable', 'liar', 
'liars', 'licentious', 'licentiously', 'licentiousness', 'lie', 'lied', 
'lier', 'lies', 'life-threatening', 'lifeless', 'limit', 'limitation', 
'limitations', 'limited', 'limits', 'limp', 'listless', 'litigious', 
'little-known', 'livid', 'lividly', 'loath', 'loathe', 'loathing', 'loathly'
, 'loathsome', 'loathsomely', 'lone', 'loneliness', 'lonely', 'loner', 
'lonesome', 'long-time', 'long-winded', 'longing', 'longingly', 'loophole', 
'loopholes', 'loose', 'loot', 'lorn', 'lose', 'loser', 'losers', 'loses', 
'losing', 'loss', 'losses', 'lost', 'loud', 'louder', 'lousy', 'loveless', 
'lovelorn', 'low-rated', 'lowly', 'ludicrous', 'ludicrously', 'lugubrious', 
'lukewarm', 'lull', 'lumpy', 'lunatic', 'lunaticism', 'lurch', 'lure', 
'lurid', 'lurk', 'lurking', 'lying', 'macabre', 'mad', 'madden', 'maddening'
, 'maddeningly', 'madder', 'madly', 'madman', 'madness', 'maladjusted', 
'maladjustment', 'malady', 'malaise', 'malcontent', 'malcontented', 
'maledict', 'malevolence', 'malevolent', 'malevolently', 'malice', 
'malicious', 'maliciously', 'maliciousness', 'malign', 'malignant', 
'malodorous', 'maltreatment', 'mangle', 'mangled', 'mangles', 'mangling', 
'mania', 'maniac', 'maniacal', 'manic', 'manipulate', 'manipulation', 
'manipulative', 'manipulators', 'mar', 'marginal', 'marginally', 'martyrdom'
, 'martyrdom-seeking', 'mashed', 'massacre', 'massacres', 'matte', 'mawkish'
, 'mawkishly', 'mawkishness', 'meager', 'meaningless', 'meanness', 'measly',
 'meddle', 'meddlesome', 'mediocre', 'mediocrity', 'melancholy', 
'melodramatic', 'melodramatically', 'meltdown', 'menace', 'menacing', 
'menacingly', 'mendacious', 'mendacity', 'menial', 'merciless', 
'mercilessly', 'mess', 'messed', 'messes', 'messing', 'messy', 'midget', 
'miff', 'militancy', 'mindless', 'mindlessly', 'mirage', 'mire', 'misalign',
 'misaligned', 'misaligns', 'misapprehend', 'misbecome', 'misbecoming', 
'misbegotten', 'misbehave', 'misbehavior', 'miscalculate', 'miscalculation',
 'miscellaneous', 'mischief', 'mischievous', 'mischievously', 
'misconception', 'misconceptions', 'miscreant', 'miscreants', 'misdirection'
, 'miser', 'miserable', 'miserableness', 'miserably', 'miseries', 'miserly',
 'misery', 'misfit', 'misfortune', 'misgiving', 'misgivings', 'misguidance',
 'misguide', 'misguided', 'mishandle', 'mishap', 'misinform', 'misinformed',
 'misinterpret', 'misjudge', 'misjudgment', 'mislead', 'misleading', 
'misleadingly', 'mislike', 'mismanage', 'mispronounce', 'mispronounced', 
'mispronounces', 'misread', 'misreading', 'misrepresent', 
'misrepresentation', 'miss', 'missed', 'misses', 'misstatement', 'mist', 
'mistake', 'mistaken', 'mistakenly', 'mistakes', 'mistified', 'mistress', 
'mistrust', 'mistrustful', 'mistrustfully', 'mists', 'misunderstand', 
'misunderstanding', 'misunderstandings', 'misunderstood', 'misuse', 'moan', 
'mobster', 'mock', 'mocked', 'mockeries', 'mockery', 'mocking', 'mockingly',
 'mocks', 'molest', 'molestation', 'monotonous', 'monotony', 'monster', 
'monstrosities', 'monstrosity', 'monstrous', 'monstrously', 'moody', 'moot',
 'mope', 'morbid', 'morbidly', 'mordant', 'mordantly', 'moribund', 'moron', 
'moronic', 'morons', 'mortification', 'mortified', 'mortify', 'mortifying', 
'motionless', 'motley', 'mourn', 'mourner', 'mournful', 'mournfully', 
'muddle', 'muddy', 'mudslinger', 'mudslinging', 'mulish', 
'multi-polarization', 'mundane', 'murder', 'murderer', 'murderous', 
'murderously', 'murky', 'muscle-flexing', 'mushy', 'musty', 'mysterious', 
'mysteriously', 'mystery', 'mystify', 'myth', 'nag', 'nagging', 'naive', 
'naively', 'narrower', 'nastily', 'nastiness', 'nasty', 'naughty', 
'nauseate', 'nauseates', 'nauseating', 'nauseatingly', 'na?', 'nebulous', 
'nebulously', 'needless', 'needlessly', 'needy', 'nefarious', 'nefariously',
 'negate', 'negation', 'negative', 'negatives', 'negativity', 'neglect', 
'neglected', 'negligence', 'negligent', 'nemesis', 'nepotism', 'nervous', 
'nervously', 'nervousness', 'nettle', 'nettlesome', 'neurotic', 
'neurotically', 'niggle', 'niggles', 'nightmare', 'nightmarish', 
'nightmarishly', 'nitpick', 'nitpicking', 'noise', 'noises', 'noisier', 
'noisy', 'non-confidence', 'nonexistent', 'nonresponsive', 'nonsense', 
'nosey', 'notoriety', 'notorious', 'notoriously', 'noxious', 'nuisance', 
'numb', 'obese', 'object', 'objection', 'objectionable', 'objections', 
'oblique', 'obliterate', 'obliterated', 'oblivious', 'obnoxious', 
'obnoxiously', 'obscene', 'obscenely', 'obscenity', 'obscure', 'obscured', 
'obscures', 'obscurity', 'obsess', 'obsessive', 'obsessively', 
'obsessiveness', 'obsolete', 'obstacle', 'obstinate', 'obstinately', 
'obstruct', 'obstructed', 'obstructing', 'obstruction', 'obstructs', 
'obtrusive', 'obtuse', 'occlude', 'occluded', 'occludes', 'occluding', 'odd'
, 'odder', 'oddest', 'oddities', 'oddity', 'oddly', 'odor', 'offence', 
'offend', 'offender', 'offending', 'offenses', 'offensive', 'offensively', 
'offensiveness', 'officious', 'ominous', 'ominously', 'omission', 'omit', 
'one-sided', 'onerous', 'onerously', 'onslaught', 'opinionated', 'opponent',
 'opportunistic', 'oppose', 'opposition', 'oppositions', 'oppress', 
'oppression', 'oppressive', 'oppressively', 'oppressiveness', 'oppressors', 
'ordeal', 'orphan', 'ostracize', 'outbreak', 'outburst', 'outbursts', 
'outcast', 'outcry', 'outlaw', 'outmoded', 'outrage', 'outraged', 
'outrageous', 'outrageously', 'outrageousness', 'outrages', 'outsider', 
'over-acted', 'over-awe', 'over-balanced', 'over-hyped', 'over-priced', 
'over-valuation', 'overact', 'overacted', 'overawe', 'overbalance', 
'overbalanced', 'overbearing', 'overbearingly', 'overblown', 'overdo', 
'overdone', 'overdue', 'overemphasize', 'overheat', 'overkill', 'overloaded'
, 'overlook', 'overpaid', 'overpayed', 'overplay', 'overpower', 'overpriced'
, 'overrated', 'overreach', 'overrun', 'overshadow', 'oversight', 
'oversights', 'oversimplification', 'oversimplified', 'oversimplify', 
'oversize', 'overstate', 'overstated', 'overstatement', 'overstatements', 
'overstates', 'overtaxed', 'overthrow', 'overthrows', 'overturn', 
'overweight', 'overwhelm', 'overwhelmed', 'overwhelming', 'overwhelmingly', 
'overwhelms', 'overzealous', 'overzealously', 'overzelous', 'pain', 
'painful', 'painfull', 'painfully', 'pains', 'pale', 'pales', 'paltry', 
'pan', 'pandemonium', 'pander', 'pandering', 'panders', 'panic', 'panick', 
'panicked', 'panicking', 'panicky', 'paradoxical', 'paradoxically', 
'paralize', 'paralyzed', 'paranoia', 'paranoid', 'parasite', 'pariah', 
'parody', 'partiality', 'partisan', 'partisans', 'passe', 'passive', 
'passiveness', 'pathetic', 'pathetically', 'patronize', 'paucity', 'pauper',
 'paupers', 'payback', 'peculiar', 'peculiarly', 'pedantic', 'peeled', 
'peeve', 'peeved', 'peevish', 'peevishly', 'penalize', 'penalty', 
'perfidious', 'perfidity', 'perfunctory', 'peril', 'perilous', 'perilously',
 'perish', 'pernicious', 'perplex', 'perplexed', 'perplexing', 'perplexity',
 'persecute', 'persecution', 'pertinacious', 'pertinaciously', 'pertinacity'
, 'perturb', 'perturbed', 'pervasive', 'perverse', 'perversely', 
'perversion', 'perversity', 'pervert', 'perverted', 'perverts', 'pessimism',
 'pessimistic', 'pessimistically', 'pest', 'pestilent', 'petrified', 
'petrify', 'pettifog', 'petty', 'phobia', 'phobic', 'phony', 'picket', 
'picketed', 'picketing', 'pickets', 'picky', 'pig', 'pigs', 'pillage', 
'pillory', 'pimple', 'pinch', 'pique', 'pitiable', 'pitiful', 'pitifully', 
'pitiless', 'pitilessly', 'pittance', 'pity', 'plagiarize', 'plague', 
'plasticky', 'plaything', 'plea', 'pleas', 'plebeian', 'plight', 'plot', 
'plotters', 'ploy', 'plunder', 'plunderer', 'pointless', 'pointlessly', 
'poison', 'poisonous', 'poisonously', 'pokey', 'poky', 'polarisation', 
'polemize', 'pollute', 'polluter', 'polluters', 'polution', 'pompous', 
'poor', 'poorer', 'poorest', 'poorly', 'posturing', 'pout', 'poverty', 
'powerless', 'prate', 'pratfall', 'prattle', 'precarious', 'precariously', 
'precipitate', 'precipitous', 'predatory', 'predicament', 'prejudge', 
'prejudice', 'prejudices', 'prejudicial', 'premeditated', 'preoccupy', 
'preposterous', 'preposterously', 'presumptuous', 'presumptuously', 
'pretence', 'pretend', 'pretense', 'pretentious', 'pretentiously', 
'prevaricate', 'pricey', 'pricier', 'prick', 'prickle', 'prickles', 
'prideful', 'prik', 'primitive', 'prison', 'prisoner', 'problem', 
'problematic', 'problems', 'procrastinate', 'procrastinates', 
'procrastination', 'profane', 'profanity', 'prohibit', 'prohibitive', 
'prohibitively', 'propaganda', 'propagandize', 'proprietary', 'prosecute', 
'protest', 'protested', 'protesting', 'protests', 'protracted', 
'provocation', 'provocative', 'provoke', 'pry', 'pugnacious', 'pugnaciously'
, 'pugnacity', 'punch', 'punish', 'punishable', 'punitive', 'punk', 'puny', 
'puppet', 'puppets', 'puzzled', 'puzzlement', 'puzzling', 'quack', 'qualm', 
'qualms', 'quandary', 'quarrel', 'quarrellous', 'quarrellously', 'quarrels',
 'quarrelsome', 'quash', 'queer', 'questionable', 'quibble', 'quibbles', 
'quitter', 'rabid', 'racism', 'racist', 'racists', 'racy', 'radical', 
'radicalization', 'radically', 'radicals', 'rage', 'ragged', 'raging', 
'rail', 'raked', 'rampage', 'rampant', 'ramshackle', 'rancor', 'randomly', 
'rankle', 'rant', 'ranted', 'ranting', 'rantingly', 'rants', 'rape', 'raped'
, 'raping', 'rascal', 'rascals', 'rash', 'rattle', 'rattled', 'rattles', 
'ravage', 'raving', 'reactionary', 'rebellious', 'rebuff', 'rebuke', 
'recalcitrant', 'recant', 'recession', 'recessionary', 'reckless', 
'recklessly', 'recklessness', 'recoil', 'recourses', 'redundancy', 
'redundant', 'refusal', 'refuse', 'refused', 'refuses', 'refusing', 
'refutation', 'refute', 'refuted', 'refutes', 'refuting', 'regress', 
'regression', 'regressive', 'regret', 'regreted', 'regretful', 'regretfully'
, 'regrets', 'regrettable', 'regrettably', 'regretted', 'reject', 'rejected'
, 'rejecting', 'rejection', 'rejects', 'relapse', 'relentless', 
'relentlessly', 'relentlessness', 'reluctance', 'reluctant', 'reluctantly', 
'remorse', 'remorseful', 'remorsefully', 'remorseless', 'remorselessly', 
'remorselessness', 'renounce', 'renunciation', 'repel', 'repetitive', 
'reprehensible', 'reprehensibly', 'reprehension', 'reprehensive', 'repress',
 'repression', 'repressive', 'reprimand', 'reproach', 'reproachful', 
'reprove', 'reprovingly', 'repudiate', 'repudiation', 'repugn', 'repugnance'
, 'repugnant', 'repugnantly', 'repulse', 'repulsed', 'repulsing', 
'repulsive', 'repulsively', 'repulsiveness', 'resent', 'resentful', 
'resentment', 'resignation', 'resigned', 'resistance', 'restless', 
'restlessness', 'restrict', 'restricted', 'restriction', 'restrictive', 
'resurgent', 'retaliate', 'retaliatory', 'retard', 'retarded', 
'retardedness', 'retards', 'reticent', 'retract', 'retreat', 'retreated', 
'revenge', 'revengeful', 'revengefully', 'revert', 'revile', 'reviled', 
'revoke', 'revolt', 'revolting', 'revoltingly', 'revulsion', 'revulsive', 
'rhapsodize', 'rhetoric', 'rhetorical', 'ricer', 'ridicule', 'ridicules', 
'ridiculous', 'ridiculously', 'rife', 'rift', 'rifts', 'rigid', 'rigidity', 
'rigidness', 'rile', 'riled', 'rip', 'rip-off', 'ripoff', 'ripped', 'risk', 
'risks', 'risky', 'rival', 'rivalry', 'roadblocks', 'rocky', 'rogue', 
'rollercoaster', 'rot', 'rotten', 'rough', 'rremediable', 'rubbish', 'rude',
 'rue', 'ruffian', 'ruffle', 'ruin', 'ruined', 'ruining', 'ruinous', 'ruins'
, 'rumbling', 'rumor', 'rumors', 'rumours', 'rumple', 'run-down', 'runaway',
 'rupture', 'rust', 'rusts', 'rusty', 'rut', 'ruthless', 'ruthlessly', 
'ruthlessness', 'ruts', 'sabotage', 'sack', 'sacrificed', 'sad', 'sadden', 
'sadly', 'sadness', 'sag', 'sagged', 'sagging', 'saggy', 'sags', 'salacious'
, 'sanctimonious', 'sap', 'sarcasm', 'sarcastic', 'sarcastically', 
'sardonic', 'sardonically', 'sass', 'satirical', 'satirize', 'savage', 
'savaged', 'savagery', 'savages', 'scaly', 'scam', 'scams', 'scandal', 
'scandalize', 'scandalized', 'scandalous', 'scandalously', 'scandals', 
'scandel', 'scandels', 'scant', 'scapegoat', 'scar', 'scarce', 'scarcely', 
'scarcity', 'scare', 'scared', 'scarier', 'scariest', 'scarily', 'scarred', 
'scars', 'scary', 'scathing', 'scathingly', 'sceptical', 'scoff', 
'scoffingly', 'scold', 'scolded', 'scolding', 'scoldingly', 'scorching', 
'scorchingly', 'scorn', 'scornful', 'scornfully', 'scoundrel', 'scourge', 
'scowl', 'scramble', 'scrambled', 'scrambles', 'scrambling', 'scrap', 
'scratch', 'scratched', 'scratches', 'scratchy', 'scream', 'screech', 
'screw-up', 'screwed', 'screwed-up', 'screwy', 'scuff', 'scuffs', 'scum', 
'scummy', 'second-class', 'second-tier', 'secretive', 'sedentary', 'seedy', 
'seethe', 'seething', 'self-coup', 'self-criticism', 'self-defeating', 
'self-destructive', 'self-humiliation', 'self-interest', 'self-interested', 
'self-serving', 'selfinterested', 'selfish', 'selfishly', 'selfishness', 
'semi-retarded', 'senile', 'sensationalize', 'senseless', 'senselessly', 
'seriousness', 'sermonize', 'servitude', 'set-up', 'setback', 'setbacks', 
'sever', 'severe', 'severity', 'sh*t', 'shabby', 'shadowy', 'shady', 'shake'
, 'shaky', 'shallow', 'sham', 'shambles', 'shame', 'shameful', 'shamefully',
 'shamefulness', 'shameless', 'shamelessly', 'shamelessness', 'shark', 
'sharply', 'shatter', 'shemale', 'shimmer', 'shimmy', 'shipwreck', 'shirk', 
'shirker', 'shit', 'shiver', 'shock', 'shocked', 'shocking', 'shockingly', 
'shoddy', 'short-lived', 'shortage', 'shortchange', 'shortcoming', 
'shortcomings', 'shortness', 'shortsighted', 'shortsightedness', 'showdown',
 'shrew', 'shriek', 'shrill', 'shrilly', 'shrivel', 'shroud', 'shrouded', 
'shrug', 'shun', 'shunned', 'sick', 'sicken', 'sickening', 'sickeningly', 
'sickly', 'sickness', 'sidetrack', 'sidetracked', 'siege', 'sillily', 
'silly', 'simplistic', 'simplistically', 'sin', 'sinful', 'sinfully', 
'sinister', 'sinisterly', 'sink', 'sinking', 'skeletons', 'skeptic', 
'skeptical', 'skeptically', 'skepticism', 'sketchy', 'skimpy', 'skinny', 
'skittish', 'skittishly', 'skulk', 'slack', 'slander', 'slanderer', 
'slanderous', 'slanderously', 'slanders', 'slap', 'slashing', 'slaughter', 
'slaughtered', 'slave', 'slaves', 'sleazy', 'slime', 'slog', 'slogged', 
'slogging', 'slogs', 'sloooooooooooooow', 'sloooow', 'slooow', 'sloow', 
'sloppily', 'sloppy', 'sloth', 'slothful', 'slow', 'slow-moving', 'slowed', 
'slower', 'slowest', 'slowly', 'sloww', 'slowww', 'slowwww', 'slug', 
'sluggish', 'slump', 'slumping', 'slumpping', 'slur', 'slut', 'sluts', 'sly'
, 'smack', 'smallish', 'smash', 'smear', 'smell', 'smelled', 'smelling', 
'smells', 'smelly', 'smelt', 'smoke', 'smokescreen', 'smolder', 'smoldering'
, 'smother', 'smoulder', 'smouldering', 'smudge', 'smudged', 'smudges', 
'smudging', 'smug', 'smugly', 'smut', 'smuttier', 'smuttiest', 'smutty', 
'snag', 'snagged', 'snagging', 'snags', 'snappish', 'snappishly', 'snare', 
'snarky', 'snarl', 'sneak', 'sneakily', 'sneaky', 'sneer', 'sneering', 
'sneeringly', 'snob', 'snobbish', 'snobby', 'snobish', 'snobs', 'snub', 
'so-cal', 'soapy', 'sob', 'sober', 'sobering', 'solemn', 'solicitude', 
'somber', 'sore', 'sorely', 'soreness', 'sorrow', 'sorrowful', 'sorrowfully'
, 'sorry', 'sour', 'sourly', 'spade', 'spank', 'spendy', 'spew', 'spewed', 
'spewing', 'spews', 'spilling', 'spinster', 'spiritless', 'spite', 
'spiteful', 'spitefully', 'spitefulness', 'splatter', 'split', 'splitting', 
'spoil', 'spoilage', 'spoilages', 'spoiled', 'spoilled', 'spoils', 'spook', 
'spookier', 'spookiest', 'spookily', 'spooky', 'spoon-fed', 'spoon-feed', 
'spoonfed', 'sporadic', 'spotty', 'spurious', 'spurn', 'sputter', 'squabble'
, 'squabbling', 'squander', 'squash', 'squeak', 'squeaks', 'squeaky', 
'squeal', 'squealing', 'squeals', 'squirm', 'stab', 'stagnant', 'stagnate', 
'stagnation', 'staid', 'stain', 'stains', 'stale', 'stalemate', 'stall', 
'stalls', 'stammer', 'stampede', 'standstill', 'stark', 'starkly', 'startle'
, 'startling', 'startlingly', 'starvation', 'starve', 'static', 'steal', 
'stealing', 'steals', 'steep', 'steeply', 'stench', 'stereotype', 
'stereotypical', 'stereotypically', 'stern', 'stew', 'sticky', 'stiff', 
'stiffness', 'stifle', 'stifling', 'stiflingly', 'stigma', 'stigmatize', 
'sting', 'stinging', 'stingingly', 'stingy', 'stink', 'stinks', 'stodgy', 
'stole', 'stolen', 'stooge', 'stooges', 'stormy', 'straggle', 'straggler', 
'strain', 'strained', 'straining', 'strange', 'strangely', 'stranger', 
'strangest', 'strangle', 'streaky', 'strenuous', 'stress', 'stresses', 
'stressful', 'stressfully', 'stricken', 'strict', 'strictly', 'strident', 
'stridently', 'strife', 'strike', 'stringent', 'stringently', 'struck', 
'struggle', 'struggled', 'struggles', 'struggling', 'strut', 'stubborn', 
'stubbornly', 'stubbornness', 'stuck', 'stuffy', 'stumble', 'stumbled', 
'stumbles', 'stump', 'stumped', 'stumps', 'stun', 'stunt', 'stunted', 
'stupid', 'stupidest', 'stupidity', 'stupidly', 'stupified', 'stupify', 
'stupor', 'stutter', 'stuttered', 'stuttering', 'stutters', 'sty', 'stymied'
, 'sub-par', 'subdued', 'subjected', 'subjection', 'subjugate', 
'subjugation', 'submissive', 'subordinate', 'subpoena', 'subpoenas', 
'subservience', 'subservient', 'substandard', 'subtract', 'subversion', 
'subversive', 'subversively', 'subvert', 'succumb', 'suck', 'sucked', 
'sucker', 'sucks', 'sucky', 'sue', 'sued', 'sueing', 'sues', 'suffer', 
'suffered', 'sufferer', 'sufferers', 'suffering', 'suffers', 'suffocate', 
'sugar-coat', 'sugar-coated', 'sugarcoated', 'suicidal', 'suicide', 'sulk', 
'sullen', 'sully', 'sunder', 'sunk', 'sunken', 'superficial', 
'superficiality', 'superficially', 'superfluous', 'superstition', 
'superstitious', 'suppress', 'suppression', 'surrender', 'susceptible', 
'suspect', 'suspicion', 'suspicions', 'suspicious', 'suspiciously', 
'swagger', 'swamped', 'sweaty', 'swelled', 'swelling', 'swindle', 'swipe', 
'swollen', 'symptom', 'symptoms', 'syndrome', 'taboo', 'tacky', 'taint', 
'tainted', 'tamper', 'tangle', 'tangled', 'tangles', 'tank', 'tanked', 
'tanks', 'tantrum', 'tardy', 'tarnish', 'tarnished', 'tarnishes', 
'tarnishing', 'tattered', 'taunt', 'taunting', 'tauntingly', 'taunts', 
'taut', 'tawdry', 'taxing', 'tease', 'teasingly', 'tedious', 'tediously', 
'temerity', 'temper', 'tempest', 'temptation', 'tenderness', 'tense', 
'tension', 'tentative', 'tentatively', 'tenuous', 'tenuously', 'tepid', 
'terrible', 'terribleness', 'terribly', 'terror', 'terror-genic', 
'terrorism', 'terrorize', 'testily', 'testy', 'tetchily', 'tetchy', 
'thankless', 'thicker', 'thirst', 'thorny', 'thoughtless', 'thoughtlessly', 
'thoughtlessness', 'thrash', 'threat', 'threaten', 'threatening', 'threats',
 'threesome', 'throb', 'throbbed', 'throbbing', 'throbs', 'throttle', 'thug'
, 'thumb-down', 'thumbs-down', 'thwart', 'time-consuming', 'timid', 
'timidity', 'timidly', 'timidness', 'tin-y', 'tingled', 'tingling', 'tired',
 'tiresome', 'tiring', 'tiringly', 'toil', 'toll', 'top-heavy', 'topple', 
'torment', 'tormented', 'torrent', 'tortuous', 'torture', 'tortured', 
'tortures', 'torturing', 'torturous', 'torturously', 'totalitarian', 
'touchy', 'toughness', 'tout', 'touted', 'touts', 'toxic', 'traduce', 
'tragedy', 'tragic', 'tragically', 'traitor', 'traitorous', 'traitorously', 
'tramp', 'trample', 'transgress', 'transgression', 'trap', 'traped', 
'trapped', 'trash', 'trashed', 'trashy', 'trauma', 'traumatic', 
'traumatically', 'traumatize', 'traumatized', 'travesties', 'travesty', 
'treacherous', 'treacherously', 'treachery', 'treason', 'treasonous', 
'trick', 'tricked', 'trickery', 'tricky', 'trivial', 'trivialize', 'trouble'
, 'troubled', 'troublemaker', 'troubles', 'troublesome', 'troublesomely', 
'troubling', 'troublingly', 'truant', 'tumble', 'tumbled', 'tumbles', 
'tumultuous', 'turbulent', 'turmoil', 'twist', 'twisted', 'twists', 
'two-faced', 'two-faces', 'tyrannical', 'tyrannically', 'tyranny', 'tyrant',
 'ugh', 'uglier', 'ugliest', 'ugliness', 'ugly', 'ulterior', 'ultimatum', 
'ultimatums', 'ultra-hardline', 'un-viewable', 'unable', 'unacceptable', 
'unacceptablely', 'unacceptably', 'unaccessible', 'unaccustomed', 
'unachievable', 'unaffordable', 'unappealing', 'unattractive', 'unauthentic'
, 'unavailable', 'unavoidably', 'unbearable', 'unbearablely', 'unbelievable'
, 'unbelievably', 'uncaring', 'uncertain', 'uncivil', 'uncivilized', 
'unclean', 'unclear', 'uncollectible', 'uncomfortable', 'uncomfortably', 
'uncomfy', 'uncompetitive', 'uncompromising', 'uncompromisingly', 
'unconfirmed', 'unconstitutional', 'uncontrolled', 'unconvincing', 
'unconvincingly', 'uncooperative', 'uncouth', 'uncreative', 'undecided', 
'undefined', 'undependability', 'undependable', 'undercut', 'undercuts', 
'undercutting', 'underdog', 'underestimate', 'underlings', 'undermine', 
'undermined', 'undermines', 'undermining', 'underpaid', 'underpowered', 
'undersized', 'undesirable', 'undetermined', 'undid', 'undignified', 
'undissolved', 'undocumented', 'undone', 'undue', 'unease', 'uneasily', 
'uneasiness', 'uneasy', 'uneconomical', 'unemployed', 'unequal', 'unethical'
, 'uneven', 'uneventful', 'unexpected', 'unexpectedly', 'unexplained', 
'unfairly', 'unfaithful', 'unfaithfully', 'unfamiliar', 'unfavorable', 
'unfeeling', 'unfinished', 'unfit', 'unforeseen', 'unforgiving', 
'unfortunate', 'unfortunately', 'unfounded', 'unfriendly', 'unfulfilled', 
'unfunded', 'ungovernable', 'ungrateful', 'unhappily', 'unhappiness', 
'unhappy', 'unhealthy', 'unhelpful', 'unilateralism', 'unimaginable', 
'unimaginably', 'unimportant', 'uninformed', 'uninsured', 'unintelligible', 
'unintelligile', 'unipolar', 'unjust', 'unjustifiable', 'unjustifiably', 
'unjustified', 'unjustly', 'unkind', 'unkindly', 'unknown', 'unlamentable', 
'unlamentably', 'unlawful', 'unlawfully', 'unlawfulness', 'unleash', 
'unlicensed', 'unlikely', 'unlucky', 'unmoved', 'unnatural', 'unnaturally', 
'unnecessary', 'unneeded', 'unnerve', 'unnerved', 'unnerving', 'unnervingly'
, 'unnoticed', 'unobserved', 'unorthodox', 'unorthodoxy', 'unpleasant', 
'unpleasantries', 'unpopular', 'unpredictable', 'unprepared', 'unproductive'
, 'unprofitable', 'unprove', 'unproved', 'unproven', 'unproves', 'unproving'
, 'unqualified', 'unravel', 'unraveled', 'unreachable', 'unreadable', 
'unrealistic', 'unreasonable', 'unreasonably', 'unrelenting', 
'unrelentingly', 'unreliability', 'unreliable', 'unresolved', 'unresponsive'
, 'unrest', 'unruly', 'unsafe', 'unsatisfactory', 'unsavory', 'unscrupulous'
, 'unscrupulously', 'unsecure', 'unseemly', 'unsettle', 'unsettled', 
'unsettling', 'unsettlingly', 'unskilled', 'unsophisticated', 'unsound', 
'unspeakable', 'unspeakablely', 'unspecified', 'unstable', 'unsteadily', 
'unsteadiness', 'unsteady', 'unsuccessful', 'unsuccessfully', 'unsupported',
 'unsupportive', 'unsure', 'unsuspecting', 'unsustainable', 'untenable', 
'untested', 'unthinkable', 'unthinkably', 'untimely', 'untouched', 'untrue',
 'untrustworthy', 'untruthful', 'unusable', 'unusably', 'unuseable', 
'unuseably', 'unusual', 'unusually', 'unviewable', 'unwanted', 'unwarranted'
, 'unwatchable', 'unwelcome', 'unwell', 'unwieldy', 'unwilling', 
'unwillingly', 'unwillingness', 'unwise', 'unwisely', 'unworkable', 
'unworthy', 'unyielding', 'upbraid', 'upheaval', 'uprising', 'uproar', 
'uproarious', 'uproariously', 'uproarous', 'uproarously', 'uproot', 'upset',
 'upseting', 'upsets', 'upsetting', 'upsettingly', 'urgent', 'useless', 
'usurp', 'usurper', 'utterly', 'vagrant', 'vague', 'vagueness', 'vain', 
'vainly', 'vanity', 'vehement', 'vehemently', 'vengeance', 'vengeful', 
'vengefully', 'vengefulness', 'venom', 'venomous', 'venomously', 'vent', 
'vestiges', 'vex', 'vexation', 'vexing', 'vexingly', 'vibrate', 'vibrated', 
'vibrates', 'vibrating', 'vibration', 'vice', 'vicious', 'viciously', 
'viciousness', 'victimize', 'vile', 'vileness', 'vilify', 'villainous', 
'villainously', 'villains', 'villian', 'villianous', 'villianously', 
'villify', 'vindictive', 'vindictively', 'vindictiveness', 'violate', 
'violation', 'violator', 'violators', 'violent', 'violently', 'viper', 
'virulence', 'virulent', 'virulently', 'virus', 'vociferous', 'vociferously'
, 'volatile', 'volatility', 'vomit', 'vomited', 'vomiting', 'vomits', 
'vulgar', 'vulnerable', 'wack', 'wail', 'wallow', 'wane', 'waning', 'wanton'
, 'war-like', 'warily', 'wariness', 'warlike', 'warned', 'warning', 'warp', 
'warped', 'wary', 'washed-out', 'waste', 'wasted', 'wasteful', 
'wastefulness', 'wasting', 'water-down', 'watered-down', 'wayward', 'weak', 
'weaken', 'weakening', 'weaker', 'weakness', 'weaknesses', 'weariness', 
'wearisome', 'weary', 'wedge', 'weed', 'weep', 'weird', 'weirdly', 'wheedle'
, 'whimper', 'whine', 'whining', 'whiny', 'whips', 'whore', 'whores', 
'wicked', 'wickedly', 'wickedness', 'wild', 'wildly', 'wiles', 'wilt', 
'wily', 'wimpy', 'wince', 'wobble', 'wobbled', 'wobbles', 'woe', 'woebegone'
, 'woeful', 'woefully', 'womanizer', 'womanizing', 'worn', 'worried', 
'worriedly', 'worrier', 'worries', 'worrisome', 'worry', 'worrying', 
'worryingly', 'worse', 'worsen', 'worsening', 'worst', 'worthless', 
'worthlessly', 'worthlessness', 'wound', 'wounds', 'wrangle', 'wrath', 
'wreak', 'wreaked', 'wreaks', 'wreck', 'wrest', 'wrestle', 'wretch', 
'wretched', 'wretchedly', 'wretchedness', 'wrinkle', 'wrinkled', 'wrinkles',
 'wrip', 'wripped', 'wripping', 'writhe', 'wrong', 'wrongful', 'wrongly', 
'wrought', 'yawn', 'zap', 'zapped', 'zaps', 'zealot', 'zealous', 'zealously'
, 'zombie'];
var POSITIVE_WORDS = [':)', ':-)', ';)', '=)', '=-)', '(-:', '(:', '(;', ':p', 
':-J', '=D', '^_^', '<3','XD', '<:', ':>', '$_$', 'a+', 'abound', 'abounds',
 'abundance', 'abundant', 'accessable', 'accessible', 'acclaim', 'acclaimed'
, 'acclamation', 'accolade', 'accolades', 'accommodative', 'accomodative', 
'accomplish', 'accomplished', 'accomplishment', 'accomplishments', 
'accurate', 'accurately', 'achievable', 'achievement', 'achievements', 
'achievible', 'acumen', 'adaptable', 'adaptive', 'adequate', 'adjustable', 
'admirable', 'admirably', 'admiration', 'admire', 'admirer', 'admiring', 
'admiringly', 'adorable', 'adore', 'adored', 'adorer', 'adoring', 
'adoringly', 'adroit', 'adroitly', 'adulate', 'adulation', 'adulatory', 
'advanced', 'advantage', 'advantageous', 'advantageously', 'advantages', 
'adventuresome', 'adventurous', 'advocate', 'advocated', 'advocates', 
'affability', 'affable', 'affably', 'affectation', 'affection', 
'affectionate', 'affinity', 'affirm', 'affirmation', 'affirmative', 
'affluence', 'affluent', 'afford', 'affordable', 'affordably', 'afordable', 
'agile', 'agilely', 'agility', 'agreeable', 'agreeableness', 'agreeably', 
'all-around', 'alluring', 'alluringly', 'altruistic', 'altruistically', 
'amaze', 'amazed', 'amazement', 'amazes', 'amazing', 'amazingly', 
'ambitious', 'ambitiously', 'ameliorate', 'amenable', 'amenity', 
'amiability', 'amiabily', 'amiable', 'amicability', 'amicable', 'amicably', 
'amity', 'ample', 'amply', 'amuse', 'amusing', 'amusingly', 'angel', 
'angelic', 'apotheosis', 'appeal', 'appealing', 'applaud', 'appreciable', 
'appreciate', 'appreciated', 'appreciates', 'appreciative', 'appreciatively'
, 'appropriate', 'approval', 'approve', 'ardent', 'ardently', 'ardor', 
'articulate', 'aspiration', 'aspirations', 'aspire', 'assurance', 
'assurances', 'assure', 'assuredly', 'assuring', 'astonish', 'astonished', 
'astonishing', 'astonishingly', 'astonishment', 'astound', 'astounded', 
'astounding', 'astoundingly', 'astutely', 'attentive', 'attraction', 
'attractive', 'attractively', 'attune', 'audible', 'audibly', 'auspicious', 
'authentic', 'authoritative', 'autonomous', 'available', 'aver', 'avid', 
'avidly', 'award', 'awarded', 'awards', 'awe', 'awed', 'awesome', 
'awesomely', 'awesomeness', 'awestruck', 'awsome', 'backbone', 'balanced', 
'bargain', 'beauteous', 'beautiful', 'beautifullly', 'beautifully', 
'beautify', 'beauty', 'beckon', 'beckoned', 'beckoning', 'beckons', 
'believable', 'believeable', 'beloved', 'benefactor', 'beneficent', 
'beneficial', 'beneficially', 'beneficiary', 'benefit', 'benefits', 
'benevolence', 'benevolent', 'benifits', 'best', 'best-known', 
'best-performing', 'best-selling', 'better', 'better-known', 
'better-than-expected', 'beutifully', 'blameless', 'bless', 'blessing', 
'bliss', 'blissful', 'blissfully', 'blithe', 'blockbuster', 'bloom', 
'blossom', 'bolster', 'bonny', 'bonus', 'bonuses', 'boom', 'booming', 
'boost', 'boundless', 'bountiful', 'brainiest', 'brainy', 'brand-new', 
'brave', 'bravery', 'bravo', 'breakthrough', 'breakthroughs', 
'breathlessness', 'breathtaking', 'breathtakingly', 'breeze', 'bright', 
'brighten', 'brighter', 'brightest', 'brilliance', 'brilliances', 
'brilliant', 'brilliantly', 'brisk', 'brotherly', 'bullish', 'buoyant', 
'cajole', 'calm', 'calming', 'calmness', 'capability', 'capable', 'capably',
 'captivate', 'captivating', 'carefree', 'cashback', 'cashbacks', 'catchy', 
'celebrate', 'celebrated', 'celebration', 'celebratory', 'champ', 'champion'
, 'charisma', 'charismatic', 'charitable', 'charm', 'charming', 'charmingly'
, 'chaste', 'cheaper', 'cheapest', 'cheer', 'cheerful', 'cheery', 'cherish',
 'cherished', 'cherub', 'chic', 'chivalrous', 'chivalry', 'civility', 
'civilize', 'clarity', 'classic', 'classy', 'clean', 'cleaner', 'cleanest', 
'cleanliness', 'cleanly', 'clear', 'clear-cut', 'cleared', 'clearer', 
'clearly', 'clears', 'clever', 'cleverly', 'cohere', 'coherence', 'coherent'
, 'cohesive', 'colorful', 'comely', 'comfort', 'comfortable', 'comfortably',
 'comforting', 'comfy', 'commend', 'commendable', 'commendably', 
'commitment', 'commodious', 'compact', 'compactly', 'compassion', 
'compassionate', 'compatible', 'competitive', 'complement', 'complementary',
 'complemented', 'complements', 'compliant', 'compliment', 'complimentary', 
'comprehensive', 'conciliate', 'conciliatory', 'concise', 'confidence', 
'confident', 'congenial', 'congratulate', 'congratulation', 
'congratulations', 'congratulatory', 'conscientious', 'considerate', 
'consistent', 'consistently', 'constructive', 'consummate', 'contentment', 
'continuity', 'contrasty', 'contribution', 'convenience', 'convenient', 
'conveniently', 'convience', 'convienient', 'convient', 'convincing', 
'convincingly', 'cool', 'coolest', 'cooperative', 'cooperatively', 
'cornerstone', 'correct', 'correctly', 'cost-effective', 'cost-saving', 
'counter-attack', 'counter-attacks', 'courage', 'courageous', 'courageously'
, 'courageousness', 'courteous', 'courtly', 'covenant', 'cozy', 'creative', 
'credence', 'credible', 'crisp', 'crisper', 'cure', 'cure-all', 'cushy', 
'cute', 'cuteness', 'danke', 'danken', 'daring', 'daringly', 'darling', 
'dashing', 'dauntless', 'dawn', 'dazzle', 'dazzled', 'dazzling', 
'dead-cheap', 'dead-on', 'decency', 'decent', 'decisive', 'decisiveness', 
'dedicated', 'defeat', 'defeated', 'defeating', 'defeats', 'defender', 
'deference', 'deft', 'deginified', 'delectable', 'delicacy', 'delicate', 
'delicious', 'delight', 'delighted', 'delightful', 'delightfully', 
'delightfulness', 'dependable', 'dependably', 'deservedly', 'deserving', 
'desirable', 'desiring', 'desirous', 'destiny', 'detachable', 'devout', 
'dexterous', 'dexterously', 'dextrous', 'dignified', 'dignify', 'dignity', 
'diligence', 'diligent', 'diligently', 'diplomatic', 'dirt-cheap', 
'distinction', 'distinctive', 'distinguished', 'diversified', 'divine', 
'divinely', 'dominate', 'dominated', 'dominates', 'dote', 'dotingly', 
'doubtless', 'dreamland', 'dumbfounded', 'dumbfounding', 'dummy-proof', 
'durable', 'dynamic', 'eager', 'eagerly', 'eagerness', 'earnest', 
'earnestly', 'earnestness', 'ease', 'eased', 'eases', 'easier', 'easiest', 
'easiness', 'easing', 'easy', 'easy-to-use', 'easygoing', 'ebullience', 
'ebullient', 'ebulliently', 'ecenomical', 'economical', 'ecstasies', 
'ecstasy', 'ecstatic', 'ecstatically', 'edify', 'educated', 'effective', 
'effectively', 'effectiveness', 'effectual', 'efficacious', 'efficient', 
'efficiently', 'effortless', 'effortlessly', 'effusion', 'effusive', 
'effusively', 'effusiveness', 'elan', 'elate', 'elated', 'elatedly', 
'elation', 'electrify', 'elegance', 'elegant', 'elegantly', 'elevate', 
'elite', 'eloquence', 'eloquent', 'eloquently', 'embolden', 'eminence', 
'eminent', 'empathize', 'empathy', 'empower', 'empowerment', 'enchant', 
'enchanted', 'enchanting', 'enchantingly', 'encourage', 'encouragement', 
'encouraging', 'encouragingly', 'endear', 'endearing', 'endorse', 'endorsed'
, 'endorsement', 'endorses', 'endorsing', 'energetic', 'energize', 
'energy-efficient', 'energy-saving', 'engaging', 'engrossing', 'enhance', 
'enhanced', 'enhancement', 'enhances', 'enjoy', 'enjoyable', 'enjoyably', 
'enjoyed', 'enjoying', 'enjoyment', 'enjoys', 'enlighten', 'enlightenment', 
'enliven', 'ennoble', 'enough', 'enrapt', 'enrapture', 'enraptured', 
'enrich', 'enrichment', 'enterprising', 'entertain', 'entertaining', 
'entertains', 'enthral', 'enthrall', 'enthralled', 'enthuse', 'enthusiasm', 
'enthusiast', 'enthusiastic', 'enthusiastically', 'entice', 'enticed', 
'enticing', 'enticingly', 'entranced', 'entrancing', 'entrust', 'enviable', 
'enviably', 'envious', 'enviously', 'enviousness', 'envy', 'equitable', 
'ergonomical', 'err-free', 'erudite', 'ethical', 'eulogize', 'euphoria', 
'euphoric', 'euphorically', 'evaluative', 'evenly', 'eventful', 
'everlasting', 'evocative', 'exalt', 'exaltation', 'exalted', 'exaltedly', 
'exalting', 'exaltingly', 'examplar', 'examplary', 'excallent', 'exceed', 
'exceeded', 'exceeding', 'exceedingly', 'exceeds', 'excel', 'exceled', 
'excelent', 'excellant', 'excelled', 'excellence', 'excellency', 'excellent'
, 'excellently', 'excels', 'exceptional', 'exceptionally', 'excite', 
'excited', 'excitedly', 'excitedness', 'excitement', 'excites', 'exciting', 
'excitingly', 'exellent', 'exemplar', 'exemplary', 'exhilarate', 
'exhilarating', 'exhilaratingly', 'exhilaration', 'exonerate', 'expansive', 
'expeditiously', 'expertly', 'exquisite', 'exquisitely', 'extol', 'extoll', 
'extraordinarily', 'extraordinary', 'exuberance', 'exuberant', 'exuberantly'
, 'exult', 'exultant', 'exultation', 'exultingly', 'eye-catch', 
'eye-catching', 'eyecatch', 'eyecatching', 'fabulous', 'fabulously', 
'facilitate', 'fair', 'fairly', 'fairness', 'faith', 'faithful', 
'faithfully', 'faithfulness', 'fame', 'famed', 'famous', 'famously', 
'fancier', 'fancinating', 'fancy', 'fanfare', 'fans', 'fantastic', 
'fantastically', 'fascinate', 'fascinating', 'fascinatingly', 'fascination',
 'fashionable', 'fashionably', 'fast', 'fast-growing', 'fast-paced', 
'faster', 'fastest', 'fastest-growing', 'faultless', 'fav', 'fave', 'favor',
 'favorable', 'favored', 'favorite', 'favorited', 'favour', 'fearless', 
'fearlessly', 'feasible', 'feasibly', 'feat', 'feature-rich', 'fecilitous', 
'feisty', 'felicitate', 'felicitous', 'felicity', 'fertile', 'fervent', 
'fervently', 'fervid', 'fervidly', 'fervor', 'festive', 'fidelity', 'fiery',
 'fine', 'fine-looking', 'finely', 'finer', 'finest', 'firmer', 
'first-class', 'first-in-class', 'first-rate', 'flashy', 'flatter', 
'flattering', 'flatteringly', 'flawless', 'flawlessly', 'flexibility', 
'flexible', 'flourish', 'flourishing', 'fluent', 'flutter', 'fond', 'fondly'
, 'fondness', 'foolproof', 'foremost', 'foresight', 'formidable', 
'fortitude', 'fortuitous', 'fortuitously', 'fortunate', 'fortunately', 
'fortune', 'fragrant', 'free', 'freed', 'freedom', 'freedoms', 'fresh', 
'fresher', 'freshest', 'friendliness', 'friendly', 'frolic', 'frugal', 
'fruitful', 'ftw', 'fulfillment', 'fun', 'futurestic', 'futuristic', 
'gaiety', 'gaily', 'gain', 'gained', 'gainful', 'gainfully', 'gaining', 
'gains', 'gallant', 'gallantly', 'galore', 'geekier', 'geeky', 'gem', 'gems'
, 'generosity', 'generous', 'generously', 'genial', 'genius', 'gentle', 
'gentlest', 'genuine', 'gifted', 'glad', 'gladden', 'gladly', 'gladness', 
'glamorous', 'glee', 'gleeful', 'gleefully', 'glimmer', 'glimmering', 
'glisten', 'glistening', 'glitter', 'glitz', 'glorify', 'glorious', 
'gloriously', 'glory', 'glow', 'glowing', 'glowingly', 'god-given', 
'god-send', 'godlike', 'godsend', 'gold', 'golden', 'good', 'goodly', 
'goodness', 'goodwill', 'goood', 'gooood', 'gorgeous', 'gorgeously', 'grace'
, 'graceful', 'gracefully', 'gracious', 'graciously', 'graciousness', 
'grand', 'grandeur', 'grateful', 'gratefully', 'gratification', 'gratified',
 'gratifies', 'gratify', 'gratifying', 'gratifyingly', 'gratitude', 'great',
 'greatest', 'greatness', 'grin', 'groundbreaking', 'guarantee', 'guidance',
 'guiltless', 'gumption', 'gush', 'gusto', 'gutsy', 'hail', 'halcyon', 
'hale', 'hallmark', 'hallmarks', 'hallowed', 'handier', 'handily', 
'hands-down', 'handsome', 'handsomely', 'handy', 'happier', 'happily', 
'happiness', 'happy', 'hard-working', 'hardier', 'hardy', 'harmless', 
'harmonious', 'harmoniously', 'harmonize', 'harmony', 'headway', 'heal', 
'healthful', 'healthy', 'hearten', 'heartening', 'heartfelt', 'heartily', 
'heartwarming', 'heaven', 'heavenly', 'helped', 'helpful', 'helping', 'hero'
, 'heroic', 'heroically', 'heroine', 'heroize', 'heros', 'high-quality', 
'high-spirited', 'hilarious', 'holy', 'homage', 'honest', 'honesty', 'honor'
, 'honorable', 'honored', 'honoring', 'hooray', 'hopeful', 'hospitable', 
'hot', 'hotcake', 'hotcakes', 'hottest', 'hug', 'humane', 'humble', 
'humility', 'humor', 'humorous', 'humorously', 'humour', 'humourous', 
'ideal', 'idealize', 'ideally', 'idol', 'idolize', 'idolized', 'idyllic', 
'illuminate', 'illuminati', 'illuminating', 'illumine', 'illustrious', 'ilu'
, 'imaculate', 'imaginative', 'immaculate', 'immaculately', 'immense', 
'impartial', 'impartiality', 'impartially', 'impassioned', 'impeccable', 
'impeccably', 'important', 'impress', 'impressed', 'impresses', 'impressive'
, 'impressively', 'impressiveness', 'improve', 'improved', 'improvement', 
'improvements', 'improves', 'improving', 'incredible', 'incredibly', 
'indebted', 'individualized', 'indulgence', 'indulgent', 'industrious', 
'inestimable', 'inestimably', 'inexpensive', 'infallibility', 'infallible', 
'infallibly', 'influential', 'ingenious', 'ingeniously', 'ingenuity', 
'ingenuous', 'ingenuously', 'innocuous', 'innovation', 'innovative', 
'inpressed', 'insightful', 'insightfully', 'inspiration', 'inspirational', 
'inspire', 'inspiring', 'instantly', 'instructive', 'instrumental', 
'integral', 'integrated', 'intelligence', 'intelligent', 'intelligible', 
'interesting', 'interests', 'intimacy', 'intimate', 'intricate', 'intrigue',
 'intriguing', 'intriguingly', 'intuitive', 'invaluable', 'invaluablely', 
'inventive', 'invigorate', 'invigorating', 'invincibility', 'invincible', 
'inviolable', 'inviolate', 'invulnerable', 'irreplaceable', 'irreproachable'
, 'irresistible', 'irresistibly', 'issue-free', 'jaw-droping', 
'jaw-dropping', 'jollify', 'jolly', 'jovial', 'joy', 'joyful', 'joyfully', 
'joyous', 'joyously', 'jubilant', 'jubilantly', 'jubilate', 'jubilation', 
'jubiliant', 'judicious', 'justly', 'keen', 'keenly', 'keenness', 
'kid-friendly', 'kindliness', 'kindly', 'kindness', 'knowledgeable', 'kudos'
, 'large-capacity', 'laud', 'laudable', 'laudably', 'lavish', 'lavishly', 
'law-abiding', 'lawful', 'lawfully', 'lead', 'leading', 'leads', 'lean', 
'led', 'legendary', 'leverage', 'levity', 'liberate', 'liberation', 
'liberty', 'lifesaver', 'light-hearted', 'lighter', 'likable', 'like', 
'liked', 'likes', 'liking', 'lionhearted', 'lively', 'logical', 
'long-lasting', 'lovable', 'lovably', 'love', 'loved', 'loveliness', 
'lovely', 'lover', 'loves', 'loving', 'low-cost', 'low-price', 'low-priced',
 'low-risk', 'lower-priced', 'loyal', 'loyalty', 'lucid', 'lucidly', 'luck',
 'luckier', 'luckiest', 'luckiness', 'lucky', 'lucrative', 'luminous', 
'lush', 'luster', 'lustrous', 'luxuriant', 'luxuriate', 'luxurious', 
'luxuriously', 'luxury', 'lyrical', 'magic', 'magical', 'magnanimous', 
'magnanimously', 'magnificence', 'magnificent', 'magnificently', 'majestic',
 'majesty', 'manageable', 'maneuverable', 'marvel', 'marveled', 'marvelled',
 'marvellous', 'marvelous', 'marvelously', 'marvelousness', 'marvels', 
'master', 'masterful', 'masterfully', 'masterpiece', 'masterpieces', 
'masters', 'mastery', 'matchless', 'mature', 'maturely', 'maturity', 
'meaningful', 'memorable', 'merciful', 'mercifully', 'mercy', 'merit', 
'meritorious', 'merrily', 'merriment', 'merriness', 'merry', 'mesmerize', 
'mesmerized', 'mesmerizes', 'mesmerizing', 'mesmerizingly', 'meticulous', 
'meticulously', 'mightily', 'mighty', 'mind-blowing', 'miracle', 'miracles',
 'miraculous', 'miraculously', 'miraculousness', 'modern', 'modest', 
'modesty', 'momentous', 'monumental', 'monumentally', 'morality', 
'motivated', 'multi-purpose', 'navigable', 'neat', 'neatest', 'neatly', 
'nice', 'nicely', 'nicer', 'nicest', 'nifty', 'nimble', 'noble', 'nobly', 
'noiseless', 'non-violence', 'non-violent', 'notably', 'noteworthy', 
'nourish', 'nourishing', 'nourishment', 'novelty', 'nurturing', 'oasis', 
'obsession', 'obsessions', 'obtainable', 'openly', 'openness', 'optimal', 
'optimism', 'optimistic', 'opulent', 'orderly', 'originality', 'outdo', 
'outdone', 'outperform', 'outperformed', 'outperforming', 'outperforms', 
'outshine', 'outshone', 'outsmart', 'outstanding', 'outstandingly', 
'outstrip', 'outwit', 'ovation', 'overjoyed', 'overtake', 'overtaken', 
'overtakes', 'overtaking', 'overtook', 'overture', 'pain-free', 'painless', 
'painlessly', 'palatial', 'pamper', 'pampered', 'pamperedly', 'pamperedness'
, 'pampers', 'panoramic', 'paradise', 'paramount', 'pardon', 'passion', 
'passionate', 'passionately', 'patience', 'patient', 'patiently', 'patriot',
 'patriotic', 'peace', 'peaceable', 'peaceful', 'peacefully', 'peacekeepers'
, 'peach', 'peerless', 'pep', 'pepped', 'pepping', 'peppy', 'peps', 
'perfect', 'perfection', 'perfectly', 'permissible', 'perseverance', 
'persevere', 'personages', 'personalized', 'phenomenal', 'phenomenally', 
'picturesque', 'piety', 'pinnacle', 'playful', 'playfully', 'pleasant', 
'pleasantly', 'pleased', 'pleases', 'pleasing', 'pleasingly', 'pleasurable',
 'pleasurably', 'pleasure', 'plentiful', 'pluses', 'plush', 'plusses', 
'poetic', 'poeticize', 'poignant', 'poise', 'poised', 'polished', 'polite', 
'politeness', 'popular', 'portable', 'posh', 'positive', 'positively', 
'positives', 'powerful', 'powerfully', 'praise', 'praiseworthy', 'praising',
 'pre-eminent', 'precious', 'precise', 'precisely', 'preeminent', 'prefer', 
'preferable', 'preferably', 'prefered', 'preferes', 'preferring', 'prefers',
 'premier', 'prestige', 'prestigious', 'prettily', 'pretty', 'priceless', 
'pride', 'principled', 'privilege', 'privileged', 'prize', 'proactive', 
'problem-free', 'problem-solver', 'prodigious', 'prodigiously', 'prodigy', 
'productive', 'productively', 'proficient', 'proficiently', 'profound', 
'profoundly', 'profuse', 'profusion', 'progress', 'progressive', 'prolific',
 'prominence', 'prominent', 'promise', 'promised', 'promises', 'promising', 
'promoter', 'prompt', 'promptly', 'proper', 'properly', 'propitious', 
'propitiously', 'pros', 'prosper', 'prosperity', 'prosperous', 'prospros', 
'protect', 'protection', 'protective', 'proud', 'proven', 'proves', 
'providence', 'proving', 'prowess', 'prudence', 'prudent', 'prudently', 
'punctual', 'pure', 'purify', 'purposeful', 'quaint', 'qualified', 'qualify'
, 'quicker', 'quiet', 'quieter', 'radiance', 'radiant', 'rapid', 'rapport', 
'rapt', 'rapture', 'raptureous', 'raptureously', 'rapturous', 'rapturously',
 'rational', 'razor-sharp', 'reachable', 'readable', 'readily', 'ready', 
'reaffirm', 'reaffirmation', 'realistic', 'realizable', 'reasonable', 
'reasonably', 'reasoned', 'reassurance', 'reassure', 'receptive', 'reclaim',
 'recomend', 'recommend', 'recommendation', 'recommendations', 'recommended'
, 'reconcile', 'reconciliation', 'record-setting', 'recover', 'recovery', 
'rectification', 'rectify', 'rectifying', 'redeem', 'redeeming', 
'redemption', 'refine', 'refined', 'refinement', 'reform', 'reformed', 
'reforming', 'reforms', 'refresh', 'refreshed', 'refreshing', 'refund', 
'refunded', 'regal', 'regally', 'regard', 'rejoice', 'rejoicing', 
'rejoicingly', 'rejuvenate', 'rejuvenated', 'rejuvenating', 'relaxed', 
'relent', 'reliable', 'reliably', 'relief', 'relish', 'remarkable', 
'remarkably', 'remedy', 'remission', 'remunerate', 'renaissance', 'renewed',
 'renown', 'renowned', 'replaceable', 'reputable', 'reputation', 'resilient'
, 'resolute', 'resound', 'resounding', 'resourceful', 'resourcefulness', 
'respect', 'respectable', 'respectful', 'respectfully', 'respite', 
'resplendent', 'responsibly', 'responsive', 'restful', 'restored', 
'restructure', 'restructured', 'restructuring', 'retractable', 'revel', 
'revelation', 'revere', 'reverence', 'reverent', 'reverently', 'revitalize',
 'revival', 'revive', 'revives', 'revolutionary', 'revolutionize', 
'revolutionized', 'revolutionizes', 'reward', 'rewarding', 'rewardingly', 
'rich', 'richer', 'richly', 'richness', 'right', 'righten', 'righteous', 
'righteously', 'righteousness', 'rightful', 'rightfully', 'rightly', 
'rightness', 'risk-free', 'robust', 'rock-star', 'rock-stars', 'rockstar', 
'rockstars', 'romantic', 'romantically', 'romanticize', 'roomier', 'roomy', 
'rosy', 'safe', 'safely', 'sagacity', 'sagely', 'saint', 'saintliness', 
'saintly', 'salutary', 'salute', 'sane', 'satisfactorily', 'satisfactory', 
'satisfied', 'satisfies', 'satisfy', 'satisfying', 'satisified', 'saver', 
'savings', 'savior', 'savvy', 'scenic', 'seamless', 'seasoned', 'secure', 
'securely', 'selective', 'self-determination', 'self-respect', 
'self-satisfaction', 'self-sufficiency', 'self-sufficient', 'sensation', 
'sensational', 'sensationally', 'sensations', 'sensible', 'sensibly', 
'sensitive', 'serene', 'serenity', 'sexy', 'sharp', 'sharper', 'sharpest', 
'shimmering', 'shimmeringly', 'shine', 'shiny', 'significant', 'silent', 
'simpler', 'simplest', 'simplified', 'simplifies', 'simplify', 'simplifying'
, 'sincere', 'sincerely', 'sincerity', 'skill', 'skilled', 'skillful', 
'skillfully', 'slammin', 'sleek', 'slick', 'smart', 'smarter', 'smartest', 
'smartly', 'smile', 'smiles', 'smiling', 'smilingly', 'smitten', 'smooth', 
'smoother', 'smoothes', 'smoothest', 'smoothly', 'snappy', 'snazzy', 
'sociable', 'soft', 'softer', 'solace', 'solicitous', 'solicitously', 
'solid', 'solidarity', 'soothe', 'soothingly', 'sophisticated', 'soulful', 
'soundly', 'soundness', 'spacious', 'sparkle', 'sparkling', 'spectacular', 
'spectacularly', 'speedily', 'speedy', 'spellbind', 'spellbinding', 
'spellbindingly', 'spellbound', 'spirited', 'spiritual', 'splendid', 
'splendidly', 'splendor', 'spontaneous', 'sporty', 'spotless', 'sprightly', 
'stability', 'stabilize', 'stable', 'stainless', 'standout', 
'state-of-the-art', 'stately', 'statuesque', 'staunch', 'staunchly', 
'staunchness', 'steadfast', 'steadfastly', 'steadfastness', 'steadiest', 
'steadiness', 'steady', 'stellar', 'stellarly', 'stimulate', 'stimulates', 
'stimulating', 'stimulative', 'stirringly', 'straighten', 'straightforward',
 'streamlined', 'striking', 'strikingly', 'striving', 'strong', 'stronger', 
'strongest', 'stunned', 'stunning', 'stunningly', 'stupendous', 
'stupendously', 'sturdier', 'sturdy', 'stylish', 'stylishly', 'stylized', 
'suave', 'suavely', 'sublime', 'subsidize', 'subsidized', 'subsidizes', 
'subsidizing', 'substantive', 'succeed', 'succeeded', 'succeeding', 
'succeeds', 'succes', 'success', 'successes', 'successful', 'successfully', 
'suffice', 'sufficed', 'suffices', 'sufficient', 'sufficiently', 'suitable',
 'sumptuous', 'sumptuously', 'sumptuousness', 'super', 'superb', 'superbly',
 'superior', 'superiority', 'supple', 'support', 'supported', 'supporter', 
'supporting', 'supportive', 'supports', 'supremacy', 'supreme', 'supremely',
 'supurb', 'supurbly', 'surmount', 'surpass', 'surreal', 'survival', 
'survivor', 'sustainability', 'sustainable', 'swank', 'swankier', 
'swankiest', 'swanky', 'sweeping', 'sweet', 'sweeten', 'sweetheart', 
'sweetly', 'sweetness', 'swift', 'swiftness', 'talent', 'talented', 
'talents', 'tantalize', 'tantalizing', 'tantalizingly', 'tempt', 'tempting',
 'temptingly', 'tenacious', 'tenaciously', 'tenacity', 'tender', 'tenderly',
 'terrific', 'terrifically', 'thank', 'thankful', 'thinner', 'thoughtful', 
'thoughtfully', 'thoughtfulness', 'thrift', 'thrifty', 'thrill', 'thrilled',
 'thrilling', 'thrillingly', 'thrills', 'thrive', 'thriving', 'thumb-up', 
'thumbs-up', 'tickle', 'tidy', 'time-honored', 'timely', 'tingle', 
'titillate', 'titillating', 'titillatingly', 'togetherness', 'tolerable', 
'toll-free', 'top', 'top-notch', 'top-quality', 'topnotch', 'tops', 'tough',
 'tougher', 'toughest', 'traction', 'tranquil', 'tranquility', 'transparent'
, 'treasure', 'tremendously', 'trendy', 'triumph', 'triumphal', 'triumphant'
, 'triumphantly', 'trivially', 'trophy', 'trouble-free', 'trump', 'trumpet',
 'trust', 'trusted', 'trusting', 'trustingly', 'trustworthiness', 
'trustworthy', 'trusty', 'truthful', 'truthfully', 'truthfulness', 'twinkly'
, 'ultra-crisp', 'unabashed', 'unabashedly', 'unaffected', 'unassailable', 
'unbeatable', 'unbiased', 'unbound', 'uncomplicated', 'unconditional', 
'undamaged', 'undaunted', 'understandable', 'undisputable', 'undisputably', 
'undisputed', 'unencumbered', 'unequivocal', 'unequivocally', 'unfazed', 
'unfettered', 'unforgettable', 'unity', 'unlimited', 'unmatched', 
'unparalleled', 'unquestionable', 'unquestionably', 'unreal', 'unrestricted'
, 'unrivaled', 'unselfish', 'unwavering', 'upbeat', 'upgradable', 
'upgradeable', 'upgraded', 'upheld', 'uphold', 'uplift', 'uplifting', 
'upliftingly', 'upliftment', 'upscale', 'usable', 'useable', 'useful', 
'user-friendly', 'user-replaceable', 'valiant', 'valiantly', 'valor', 
'valuable', 'variety', 'venerate', 'verifiable', 'veritable', 'versatile', 
'versatility', 'vibrant', 'vibrantly', 'victorious', 'victory', 'viewable', 
'vigilance', 'vigilant', 'virtue', 'virtuous', 'virtuously', 'visionary', 
'vivacious', 'vivid', 'vouch', 'vouchsafe', 'warm', 'warmer', 'warmhearted',
 'warmly', 'warmth', 'wealthy', 'welcome', 'WELL', 'well-backlit', 
'well-balanced', 'well-behaved', 'well-being', 'well-bred', 'well-connected'
, 'well-educated', 'well-established', 'well-informed', 'well-intentioned', 
'well-known', 'well-made', 'well-managed', 'well-mannered', 
'well-positioned', 'well-received', 'well-regarded', 'well-rounded', 
'well-run', 'well-wishers', 'wellbeing', 'whoa', 'wholeheartedly', 
'wholesome', 'whooa', 'whoooa', 'wieldy', 'willing', 'willingly', 
'willingness', 'win', 'windfall', 'winnable', 'winner', 'winners', 'winning'
, 'wins', 'wisdom', 'wise', 'wisely', 'witty', 'won', 'wonder', 'wonderful',
 'wonderfully', 'wonderous', 'wonderously', 'wonders', 'wondrous', 'woo', 
'work', 'workable', 'worked', 'works', 'world-famous', 'worth', 
'worth-while', 'worthiness', 'worthwhile', 'worthy', 'wow', 'wowed', 
'wowing', 'wows', 'yay', 'youthful', 'zeal', 'zenith', 'zest', 'zippy'];
var SENTIMENT_WORDS = NEGATIVE_WORDS.concat(POSITIVE_WORDS);
LISTS['sentiment']['words'] = SENTIMENT_WORDS;
/*
 * pasting jQuery right into the script for speed and security reasons 
 */

/*! jQuery v1.7.2 jquery.com | jquery.org/license */
(function(a,b){function cy(a){return f.isWindow(a)?a:a.nodeType===9?a.defaultView||a.parentWindow:!1}function cu(a){if(!cj[a]){var b=c.body,d=f("<"+a+">").appendTo(b),e=d.css("display");d.remove();if(e==="none"||e===""){ck||(ck=c.createElement("iframe"),ck.frameBorder=ck.width=ck.height=0),b.appendChild(ck);if(!cl||!ck.createElement)cl=(ck.contentWindow||ck.contentDocument).document,cl.write((f.support.boxModel?"<!doctype html>":"")+"<html><body>"),cl.close();d=cl.createElement(a),cl.body.appendChild(d),e=f.css(d,"display"),b.removeChild(ck)}cj[a]=e}return cj[a]}function ct(a,b){var c={};f.each(cp.concat.apply([],cp.slice(0,b)),function(){c[this]=a});return c}function cs(){cq=b}function cr(){setTimeout(cs,0);return cq=f.now()}function ci(){try{return new a.ActiveXObject("Microsoft.XMLHTTP")}catch(b){}}function ch(){try{return new a.XMLHttpRequest}catch(b){}}function cb(a,c){a.dataFilter&&(c=a.dataFilter(c,a.dataType));var d=a.dataTypes,e={},g,h,i=d.length,j,k=d[0],l,m,n,o,p;for(g=1;g<i;g++){if(g===1)for(h in a.converters)typeof h=="string"&&(e[h.toLowerCase()]=a.converters[h]);l=k,k=d[g];if(k==="*")k=l;else if(l!=="*"&&l!==k){m=l+" "+k,n=e[m]||e["* "+k];if(!n){p=b;for(o in e){j=o.split(" ");if(j[0]===l||j[0]==="*"){p=e[j[1]+" "+k];if(p){o=e[o],o===!0?n=p:p===!0&&(n=o);break}}}}!n&&!p&&f.error("No conversion from "+m.replace(" "," to ")),n!==!0&&(c=n?n(c):p(o(c)))}}return c}function ca(a,c,d){var e=a.contents,f=a.dataTypes,g=a.responseFields,h,i,j,k;for(i in g)i in d&&(c[g[i]]=d[i]);while(f[0]==="*")f.shift(),h===b&&(h=a.mimeType||c.getResponseHeader("content-type"));if(h)for(i in e)if(e[i]&&e[i].test(h)){f.unshift(i);break}if(f[0]in d)j=f[0];else{for(i in d){if(!f[0]||a.converters[i+" "+f[0]]){j=i;break}k||(k=i)}j=j||k}if(j){j!==f[0]&&f.unshift(j);return d[j]}}function b_(a,b,c,d){if(f.isArray(b))f.each(b,function(b,e){c||bD.test(a)?d(a,e):b_(a+"["+(typeof e=="object"?b:"")+"]",e,c,d)});else if(!c&&f.type(b)==="object")for(var e in b)b_(a+"["+e+"]",b[e],c,d);else d(a,b)}function b$(a,c){var d,e,g=f.ajaxSettings.flatOptions||{};for(d in c)c[d]!==b&&((g[d]?a:e||(e={}))[d]=c[d]);e&&f.extend(!0,a,e)}function bZ(a,c,d,e,f,g){f=f||c.dataTypes[0],g=g||{},g[f]=!0;var h=a[f],i=0,j=h?h.length:0,k=a===bS,l;for(;i<j&&(k||!l);i++)l=h[i](c,d,e),typeof l=="string"&&(!k||g[l]?l=b:(c.dataTypes.unshift(l),l=bZ(a,c,d,e,l,g)));(k||!l)&&!g["*"]&&(l=bZ(a,c,d,e,"*",g));return l}function bY(a){return function(b,c){typeof b!="string"&&(c=b,b="*");if(f.isFunction(c)){var d=b.toLowerCase().split(bO),e=0,g=d.length,h,i,j;for(;e<g;e++)h=d[e],j=/^\+/.test(h),j&&(h=h.substr(1)||"*"),i=a[h]=a[h]||[],i[j?"unshift":"push"](c)}}}function bB(a,b,c){var d=b==="width"?a.offsetWidth:a.offsetHeight,e=b==="width"?1:0,g=4;if(d>0){if(c!=="border")for(;e<g;e+=2)c||(d-=parseFloat(f.css(a,"padding"+bx[e]))||0),c==="margin"?d+=parseFloat(f.css(a,c+bx[e]))||0:d-=parseFloat(f.css(a,"border"+bx[e]+"Width"))||0;return d+"px"}d=by(a,b);if(d<0||d==null)d=a.style[b];if(bt.test(d))return d;d=parseFloat(d)||0;if(c)for(;e<g;e+=2)d+=parseFloat(f.css(a,"padding"+bx[e]))||0,c!=="padding"&&(d+=parseFloat(f.css(a,"border"+bx[e]+"Width"))||0),c==="margin"&&(d+=parseFloat(f.css(a,c+bx[e]))||0);return d+"px"}function bo(a){var b=c.createElement("div");bh.appendChild(b),b.innerHTML=a.outerHTML;return b.firstChild}function bn(a){var b=(a.nodeName||"").toLowerCase();b==="input"?bm(a):b!=="script"&&typeof a.getElementsByTagName!="undefined"&&f.grep(a.getElementsByTagName("input"),bm)}function bm(a){if(a.type==="checkbox"||a.type==="radio")a.defaultChecked=a.checked}function bl(a){return typeof a.getElementsByTagName!="undefined"?a.getElementsByTagName("*"):typeof a.querySelectorAll!="undefined"?a.querySelectorAll("*"):[]}function bk(a,b){var c;b.nodeType===1&&(b.clearAttributes&&b.clearAttributes(),b.mergeAttributes&&b.mergeAttributes(a),c=b.nodeName.toLowerCase(),c==="object"?b.outerHTML=a.outerHTML:c!=="input"||a.type!=="checkbox"&&a.type!=="radio"?c==="option"?b.selected=a.defaultSelected:c==="input"||c==="textarea"?b.defaultValue=a.defaultValue:c==="script"&&b.text!==a.text&&(b.text=a.text):(a.checked&&(b.defaultChecked=b.checked=a.checked),b.value!==a.value&&(b.value=a.value)),b.removeAttribute(f.expando),b.removeAttribute("_submit_attached"),b.removeAttribute("_change_attached"))}function bj(a,b){if(b.nodeType===1&&!!f.hasData(a)){var c,d,e,g=f._data(a),h=f._data(b,g),i=g.events;if(i){delete h.handle,h.events={};for(c in i)for(d=0,e=i[c].length;d<e;d++)f.event.add(b,c,i[c][d])}h.data&&(h.data=f.extend({},h.data))}}function bi(a,b){return f.nodeName(a,"table")?a.getElementsByTagName("tbody")[0]||a.appendChild(a.ownerDocument.createElement("tbody")):a}function U(a){var b=V.split("|"),c=a.createDocumentFragment();if(c.createElement)while(b.length)c.createElement(b.pop());return c}function T(a,b,c){b=b||0;if(f.isFunction(b))return f.grep(a,function(a,d){var e=!!b.call(a,d,a);return e===c});if(b.nodeType)return f.grep(a,function(a,d){return a===b===c});if(typeof b=="string"){var d=f.grep(a,function(a){return a.nodeType===1});if(O.test(b))return f.filter(b,d,!c);b=f.filter(b,d)}return f.grep(a,function(a,d){return f.inArray(a,b)>=0===c})}function S(a){return!a||!a.parentNode||a.parentNode.nodeType===11}function K(){return!0}function J(){return!1}function n(a,b,c){var d=b+"defer",e=b+"queue",g=b+"mark",h=f._data(a,d);h&&(c==="queue"||!f._data(a,e))&&(c==="mark"||!f._data(a,g))&&setTimeout(function(){!f._data(a,e)&&!f._data(a,g)&&(f.removeData(a,d,!0),h.fire())},0)}function m(a){for(var b in a){if(b==="data"&&f.isEmptyObject(a[b]))continue;if(b!=="toJSON")return!1}return!0}function l(a,c,d){if(d===b&&a.nodeType===1){var e="data-"+c.replace(k,"-$1").toLowerCase();d=a.getAttribute(e);if(typeof d=="string"){try{d=d==="true"?!0:d==="false"?!1:d==="null"?null:f.isNumeric(d)?+d:j.test(d)?f.parseJSON(d):d}catch(g){}f.data(a,c,d)}else d=b}return d}function h(a){var b=g[a]={},c,d;a=a.split(/\s+/);for(c=0,d=a.length;c<d;c++)b[a[c]]=!0;return b}var c=a.document,d=a.navigator,e=a.location,f=function(){function J(){if(!e.isReady){try{c.documentElement.doScroll("left")}catch(a){setTimeout(J,1);return}e.ready()}}var e=function(a,b){return new e.fn.init(a,b,h)},f=a.jQuery,g=a.$,h,i=/^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,j=/\S/,k=/^\s+/,l=/\s+$/,m=/^<(\w+)\s*\/?>(?:<\/\1>)?$/,n=/^[\],:{}\s]*$/,o=/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,p=/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,q=/(?:^|:|,)(?:\s*\[)+/g,r=/(webkit)[ \/]([\w.]+)/,s=/(opera)(?:.*version)?[ \/]([\w.]+)/,t=/(msie) ([\w.]+)/,u=/(mozilla)(?:.*? rv:([\w.]+))?/,v=/-([a-z]|[0-9])/ig,w=/^-ms-/,x=function(a,b){return(b+"").toUpperCase()},y=d.userAgent,z,A,B,C=Object.prototype.toString,D=Object.prototype.hasOwnProperty,E=Array.prototype.push,F=Array.prototype.slice,G=String.prototype.trim,H=Array.prototype.indexOf,I={};e.fn=e.prototype={constructor:e,init:function(a,d,f){var g,h,j,k;if(!a)return this;if(a.nodeType){this.context=this[0]=a,this.length=1;return this}if(a==="body"&&!d&&c.body){this.context=c,this[0]=c.body,this.selector=a,this.length=1;return this}if(typeof a=="string"){a.charAt(0)!=="<"||a.charAt(a.length-1)!==">"||a.length<3?g=i.exec(a):g=[null,a,null];if(g&&(g[1]||!d)){if(g[1]){d=d instanceof e?d[0]:d,k=d?d.ownerDocument||d:c,j=m.exec(a),j?e.isPlainObject(d)?(a=[c.createElement(j[1])],e.fn.attr.call(a,d,!0)):a=[k.createElement(j[1])]:(j=e.buildFragment([g[1]],[k]),a=(j.cacheable?e.clone(j.fragment):j.fragment).childNodes);return e.merge(this,a)}h=c.getElementById(g[2]);if(h&&h.parentNode){if(h.id!==g[2])return f.find(a);this.length=1,this[0]=h}this.context=c,this.selector=a;return this}return!d||d.jquery?(d||f).find(a):this.constructor(d).find(a)}if(e.isFunction(a))return f.ready(a);a.selector!==b&&(this.selector=a.selector,this.context=a.context);return e.makeArray(a,this)},selector:"",jquery:"1.7.2",length:0,size:function(){return this.length},toArray:function(){return F.call(this,0)},get:function(a){return a==null?this.toArray():a<0?this[this.length+a]:this[a]},pushStack:function(a,b,c){var d=this.constructor();e.isArray(a)?E.apply(d,a):e.merge(d,a),d.prevObject=this,d.context=this.context,b==="find"?d.selector=this.selector+(this.selector?" ":"")+c:b&&(d.selector=this.selector+"."+b+"("+c+")");return d},each:function(a,b){return e.each(this,a,b)},ready:function(a){e.bindReady(),A.add(a);return this},eq:function(a){a=+a;return a===-1?this.slice(a):this.slice(a,a+1)},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},slice:function(){return this.pushStack(F.apply(this,arguments),"slice",F.call(arguments).join(","))},map:function(a){return this.pushStack(e.map(this,function(b,c){return a.call(b,c,b)}))},end:function(){return this.prevObject||this.constructor(null)},push:E,sort:[].sort,splice:[].splice},e.fn.init.prototype=e.fn,e.extend=e.fn.extend=function(){var a,c,d,f,g,h,i=arguments[0]||{},j=1,k=arguments.length,l=!1;typeof i=="boolean"&&(l=i,i=arguments[1]||{},j=2),typeof i!="object"&&!e.isFunction(i)&&(i={}),k===j&&(i=this,--j);for(;j<k;j++)if((a=arguments[j])!=null)for(c in a){d=i[c],f=a[c];if(i===f)continue;l&&f&&(e.isPlainObject(f)||(g=e.isArray(f)))?(g?(g=!1,h=d&&e.isArray(d)?d:[]):h=d&&e.isPlainObject(d)?d:{},i[c]=e.extend(l,h,f)):f!==b&&(i[c]=f)}return i},e.extend({noConflict:function(b){a.$===e&&(a.$=g),b&&a.jQuery===e&&(a.jQuery=f);return e},isReady:!1,readyWait:1,holdReady:function(a){a?e.readyWait++:e.ready(!0)},ready:function(a){if(a===!0&&!--e.readyWait||a!==!0&&!e.isReady){if(!c.body)return setTimeout(e.ready,1);e.isReady=!0;if(a!==!0&&--e.readyWait>0)return;A.fireWith(c,[e]),e.fn.trigger&&e(c).trigger("ready").off("ready")}},bindReady:function(){if(!A){A=e.Callbacks("once memory");if(c.readyState==="complete")return setTimeout(e.ready,1);if(c.addEventListener)c.addEventListener("DOMContentLoaded",B,!1),a.addEventListener("load",e.ready,!1);else if(c.attachEvent){c.attachEvent("onreadystatechange",B),a.attachEvent("onload",e.ready);var b=!1;try{b=a.frameElement==null}catch(d){}c.documentElement.doScroll&&b&&J()}}},isFunction:function(a){return e.type(a)==="function"},isArray:Array.isArray||function(a){return e.type(a)==="array"},isWindow:function(a){return a!=null&&a==a.window},isNumeric:function(a){return!isNaN(parseFloat(a))&&isFinite(a)},type:function(a){return a==null?String(a):I[C.call(a)]||"object"},isPlainObject:function(a){if(!a||e.type(a)!=="object"||a.nodeType||e.isWindow(a))return!1;try{if(a.constructor&&!D.call(a,"constructor")&&!D.call(a.constructor.prototype,"isPrototypeOf"))return!1}catch(c){return!1}var d;for(d in a);return d===b||D.call(a,d)},isEmptyObject:function(a){for(var b in a)return!1;return!0},error:function(a){throw new Error(a)},parseJSON:function(b){if(typeof b!="string"||!b)return null;b=e.trim(b);if(a.JSON&&a.JSON.parse)return a.JSON.parse(b);if(n.test(b.replace(o,"@").replace(p,"]").replace(q,"")))return(new Function("return "+b))();e.error("Invalid JSON: "+b)},parseXML:function(c){if(typeof c!="string"||!c)return null;var d,f;try{a.DOMParser?(f=new DOMParser,d=f.parseFromString(c,"text/xml")):(d=new ActiveXObject("Microsoft.XMLDOM"),d.async="false",d.loadXML(c))}catch(g){d=b}(!d||!d.documentElement||d.getElementsByTagName("parsererror").length)&&e.error("Invalid XML: "+c);return d},noop:function(){},globalEval:function(b){b&&j.test(b)&&(a.execScript||function(b){a.eval.call(a,b)})(b)},camelCase:function(a){return a.replace(w,"ms-").replace(v,x)},nodeName:function(a,b){return a.nodeName&&a.nodeName.toUpperCase()===b.toUpperCase()},each:function(a,c,d){var f,g=0,h=a.length,i=h===b||e.isFunction(a);if(d){if(i){for(f in a)if(c.apply(a[f],d)===!1)break}else for(;g<h;)if(c.apply(a[g++],d)===!1)break}else if(i){for(f in a)if(c.call(a[f],f,a[f])===!1)break}else for(;g<h;)if(c.call(a[g],g,a[g++])===!1)break;return a},trim:G?function(a){return a==null?"":G.call(a)}:function(a){return a==null?"":(a+"").replace(k,"").replace(l,"")},makeArray:function(a,b){var c=b||[];if(a!=null){var d=e.type(a);a.length==null||d==="string"||d==="function"||d==="regexp"||e.isWindow(a)?E.call(c,a):e.merge(c,a)}return c},inArray:function(a,b,c){var d;if(b){if(H)return H.call(b,a,c);d=b.length,c=c?c<0?Math.max(0,d+c):c:0;for(;c<d;c++)if(c in b&&b[c]===a)return c}return-1},merge:function(a,c){var d=a.length,e=0;if(typeof c.length=="number")for(var f=c.length;e<f;e++)a[d++]=c[e];else while(c[e]!==b)a[d++]=c[e++];a.length=d;return a},grep:function(a,b,c){var d=[],e;c=!!c;for(var f=0,g=a.length;f<g;f++)e=!!b(a[f],f),c!==e&&d.push(a[f]);return d},map:function(a,c,d){var f,g,h=[],i=0,j=a.length,k=a instanceof e||j!==b&&typeof j=="number"&&(j>0&&a[0]&&a[j-1]||j===0||e.isArray(a));if(k)for(;i<j;i++)f=c(a[i],i,d),f!=null&&(h[h.length]=f);else for(g in a)f=c(a[g],g,d),f!=null&&(h[h.length]=f);return h.concat.apply([],h)},guid:1,proxy:function(a,c){if(typeof c=="string"){var d=a[c];c=a,a=d}if(!e.isFunction(a))return b;var f=F.call(arguments,2),g=function(){return a.apply(c,f.concat(F.call(arguments)))};g.guid=a.guid=a.guid||g.guid||e.guid++;return g},access:function(a,c,d,f,g,h,i){var j,k=d==null,l=0,m=a.length;if(d&&typeof d=="object"){for(l in d)e.access(a,c,l,d[l],1,h,f);g=1}else if(f!==b){j=i===b&&e.isFunction(f),k&&(j?(j=c,c=function(a,b,c){return j.call(e(a),c)}):(c.call(a,f),c=null));if(c)for(;l<m;l++)c(a[l],d,j?f.call(a[l],l,c(a[l],d)):f,i);g=1}return g?a:k?c.call(a):m?c(a[0],d):h},now:function(){return(new Date).getTime()},uaMatch:function(a){a=a.toLowerCase();var b=r.exec(a)||s.exec(a)||t.exec(a)||a.indexOf("compatible")<0&&u.exec(a)||[];return{browser:b[1]||"",version:b[2]||"0"}},sub:function(){function a(b,c){return new a.fn.init(b,c)}e.extend(!0,a,this),a.superclass=this,a.fn=a.prototype=this(),a.fn.constructor=a,a.sub=this.sub,a.fn.init=function(d,f){f&&f instanceof e&&!(f instanceof a)&&(f=a(f));return e.fn.init.call(this,d,f,b)},a.fn.init.prototype=a.fn;var b=a(c);return a},browser:{}}),e.each("Boolean Number String Function Array Date RegExp Object".split(" "),function(a,b){I["[object "+b+"]"]=b.toLowerCase()}),z=e.uaMatch(y),z.browser&&(e.browser[z.browser]=!0,e.browser.version=z.version),e.browser.webkit&&(e.browser.safari=!0),j.test(" ")&&(k=/^[\s\xA0]+/,l=/[\s\xA0]+$/),h=e(c),c.addEventListener?B=function(){c.removeEventListener("DOMContentLoaded",B,!1),e.ready()}:c.attachEvent&&(B=function(){c.readyState==="complete"&&(c.detachEvent("onreadystatechange",B),e.ready())});return e}(),g={};f.Callbacks=function(a){a=a?g[a]||h(a):{};var c=[],d=[],e,i,j,k,l,m,n=function(b){var d,e,g,h,i;for(d=0,e=b.length;d<e;d++)g=b[d],h=f.type(g),h==="array"?n(g):h==="function"&&(!a.unique||!p.has(g))&&c.push(g)},o=function(b,f){f=f||[],e=!a.memory||[b,f],i=!0,j=!0,m=k||0,k=0,l=c.length;for(;c&&m<l;m++)if(c[m].apply(b,f)===!1&&a.stopOnFalse){e=!0;break}j=!1,c&&(a.once?e===!0?p.disable():c=[]:d&&d.length&&(e=d.shift(),p.fireWith(e[0],e[1])))},p={add:function(){if(c){var a=c.length;n(arguments),j?l=c.length:e&&e!==!0&&(k=a,o(e[0],e[1]))}return this},remove:function(){if(c){var b=arguments,d=0,e=b.length;for(;d<e;d++)for(var f=0;f<c.length;f++)if(b[d]===c[f]){j&&f<=l&&(l--,f<=m&&m--),c.splice(f--,1);if(a.unique)break}}return this},has:function(a){if(c){var b=0,d=c.length;for(;b<d;b++)if(a===c[b])return!0}return!1},empty:function(){c=[];return this},disable:function(){c=d=e=b;return this},disabled:function(){return!c},lock:function(){d=b,(!e||e===!0)&&p.disable();return this},locked:function(){return!d},fireWith:function(b,c){d&&(j?a.once||d.push([b,c]):(!a.once||!e)&&o(b,c));return this},fire:function(){p.fireWith(this,arguments);return this},fired:function(){return!!i}};return p};var i=[].slice;f.extend({Deferred:function(a){var b=f.Callbacks("once memory"),c=f.Callbacks("once memory"),d=f.Callbacks("memory"),e="pending",g={resolve:b,reject:c,notify:d},h={done:b.add,fail:c.add,progress:d.add,state:function(){return e},isResolved:b.fired,isRejected:c.fired,then:function(a,b,c){i.done(a).fail(b).progress(c);return this},always:function(){i.done.apply(i,arguments).fail.apply(i,arguments);return this},pipe:function(a,b,c){return f.Deferred(function(d){f.each({done:[a,"resolve"],fail:[b,"reject"],progress:[c,"notify"]},function(a,b){var c=b[0],e=b[1],g;f.isFunction(c)?i[a](function(){g=c.apply(this,arguments),g&&f.isFunction(g.promise)?g.promise().then(d.resolve,d.reject,d.notify):d[e+"With"](this===i?d:this,[g])}):i[a](d[e])})}).promise()},promise:function(a){if(a==null)a=h;else for(var b in h)a[b]=h[b];return a}},i=h.promise({}),j;for(j in g)i[j]=g[j].fire,i[j+"With"]=g[j].fireWith;i.done(function(){e="resolved"},c.disable,d.lock).fail(function(){e="rejected"},b.disable,d.lock),a&&a.call(i,i);return i},when:function(a){function m(a){return function(b){e[a]=arguments.length>1?i.call(arguments,0):b,j.notifyWith(k,e)}}function l(a){return function(c){b[a]=arguments.length>1?i.call(arguments,0):c,--g||j.resolveWith(j,b)}}var b=i.call(arguments,0),c=0,d=b.length,e=Array(d),g=d,h=d,j=d<=1&&a&&f.isFunction(a.promise)?a:f.Deferred(),k=j.promise();if(d>1){for(;c<d;c++)b[c]&&b[c].promise&&f.isFunction(b[c].promise)?b[c].promise().then(l(c),j.reject,m(c)):--g;g||j.resolveWith(j,b)}else j!==a&&j.resolveWith(j,d?[a]:[]);return k}}),f.support=function(){var b,d,e,g,h,i,j,k,l,m,n,o,p=c.createElement("div"),q=c.documentElement;p.setAttribute("className","t"),p.innerHTML="   <link/><table></table><a href='/a' style='top:1px;float:left;opacity:.55;'>a</a><input type='checkbox'/>",d=p.getElementsByTagName("*"),e=p.getElementsByTagName("a")[0];if(!d||!d.length||!e)return{};g=c.createElement("select"),h=g.appendChild(c.createElement("option")),i=p.getElementsByTagName("input")[0],b={leadingWhitespace:p.firstChild.nodeType===3,tbody:!p.getElementsByTagName("tbody").length,htmlSerialize:!!p.getElementsByTagName("link").length,style:/top/.test(e.getAttribute("style")),hrefNormalized:e.getAttribute("href")==="/a",opacity:/^0.55/.test(e.style.opacity),cssFloat:!!e.style.cssFloat,checkOn:i.value==="on",optSelected:h.selected,getSetAttribute:p.className!=="t",enctype:!!c.createElement("form").enctype,html5Clone:c.createElement("nav").cloneNode(!0).outerHTML!=="<:nav></:nav>",submitBubbles:!0,changeBubbles:!0,focusinBubbles:!1,deleteExpando:!0,noCloneEvent:!0,inlineBlockNeedsLayout:!1,shrinkWrapBlocks:!1,reliableMarginRight:!0,pixelMargin:!0},f.boxModel=b.boxModel=c.compatMode==="CSS1Compat",i.checked=!0,b.noCloneChecked=i.cloneNode(!0).checked,g.disabled=!0,b.optDisabled=!h.disabled;try{delete p.test}catch(r){b.deleteExpando=!1}!p.addEventListener&&p.attachEvent&&p.fireEvent&&(p.attachEvent("onclick",function(){b.noCloneEvent=!1}),p.cloneNode(!0).fireEvent("onclick")),i=c.createElement("input"),i.value="t",i.setAttribute("type","radio"),b.radioValue=i.value==="t",i.setAttribute("checked","checked"),i.setAttribute("name","t"),p.appendChild(i),j=c.createDocumentFragment(),j.appendChild(p.lastChild),b.checkClone=j.cloneNode(!0).cloneNode(!0).lastChild.checked,b.appendChecked=i.checked,j.removeChild(i),j.appendChild(p);if(p.attachEvent)for(n in{submit:1,change:1,focusin:1})m="on"+n,o=m in p,o||(p.setAttribute(m,"return;"),o=typeof p[m]=="function"),b[n+"Bubbles"]=o;j.removeChild(p),j=g=h=p=i=null,f(function(){var d,e,g,h,i,j,l,m,n,q,r,s,t,u=c.getElementsByTagName("body")[0];!u||(m=1,t="padding:0;margin:0;border:",r="position:absolute;top:0;left:0;width:1px;height:1px;",s=t+"0;visibility:hidden;",n="style='"+r+t+"5px solid #000;",q="<div "+n+"display:block;'><div style='"+t+"0;display:block;overflow:hidden;'></div></div>"+"<table "+n+"' cellpadding='0' cellspacing='0'>"+"<tr><td></td></tr></table>",d=c.createElement("div"),d.style.cssText=s+"width:0;height:0;position:static;top:0;margin-top:"+m+"px",u.insertBefore(d,u.firstChild),p=c.createElement("div"),d.appendChild(p),p.innerHTML="<table><tr><td style='"+t+"0;display:none'></td><td>t</td></tr></table>",k=p.getElementsByTagName("td"),o=k[0].offsetHeight===0,k[0].style.display="",k[1].style.display="none",b.reliableHiddenOffsets=o&&k[0].offsetHeight===0,a.getComputedStyle&&(p.innerHTML="",l=c.createElement("div"),l.style.width="0",l.style.marginRight="0",p.style.width="2px",p.appendChild(l),b.reliableMarginRight=(parseInt((a.getComputedStyle(l,null)||{marginRight:0}).marginRight,10)||0)===0),typeof p.style.zoom!="undefined"&&(p.innerHTML="",p.style.width=p.style.padding="1px",p.style.border=0,p.style.overflow="hidden",p.style.display="inline",p.style.zoom=1,b.inlineBlockNeedsLayout=p.offsetWidth===3,p.style.display="block",p.style.overflow="visible",p.innerHTML="<div style='width:5px;'></div>",b.shrinkWrapBlocks=p.offsetWidth!==3),p.style.cssText=r+s,p.innerHTML=q,e=p.firstChild,g=e.firstChild,i=e.nextSibling.firstChild.firstChild,j={doesNotAddBorder:g.offsetTop!==5,doesAddBorderForTableAndCells:i.offsetTop===5},g.style.position="fixed",g.style.top="20px",j.fixedPosition=g.offsetTop===20||g.offsetTop===15,g.style.position=g.style.top="",e.style.overflow="hidden",e.style.position="relative",j.subtractsBorderForOverflowNotVisible=g.offsetTop===-5,j.doesNotIncludeMarginInBodyOffset=u.offsetTop!==m,a.getComputedStyle&&(p.style.marginTop="1%",b.pixelMargin=(a.getComputedStyle(p,null)||{marginTop:0}).marginTop!=="1%"),typeof d.style.zoom!="undefined"&&(d.style.zoom=1),u.removeChild(d),l=p=d=null,f.extend(b,j))});return b}();var j=/^(?:\{.*\}|\[.*\])$/,k=/([A-Z])/g;f.extend({cache:{},uuid:0,expando:"jQuery"+(f.fn.jquery+Math.random()).replace(/\D/g,""),noData:{embed:!0,object:"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",applet:!0},hasData:function(a){a=a.nodeType?f.cache[a[f.expando]]:a[f.expando];return!!a&&!m(a)},data:function(a,c,d,e){if(!!f.acceptData(a)){var g,h,i,j=f.expando,k=typeof c=="string",l=a.nodeType,m=l?f.cache:a,n=l?a[j]:a[j]&&j,o=c==="events";if((!n||!m[n]||!o&&!e&&!m[n].data)&&k&&d===b)return;n||(l?a[j]=n=++f.uuid:n=j),m[n]||(m[n]={},l||(m[n].toJSON=f.noop));if(typeof c=="object"||typeof c=="function")e?m[n]=f.extend(m[n],c):m[n].data=f.extend(m[n].data,c);g=h=m[n],e||(h.data||(h.data={}),h=h.data),d!==b&&(h[f.camelCase(c)]=d);if(o&&!h[c])return g.events;k?(i=h[c],i==null&&(i=h[f.camelCase(c)])):i=h;return i}},removeData:function(a,b,c){if(!!f.acceptData(a)){var d,e,g,h=f.expando,i=a.nodeType,j=i?f.cache:a,k=i?a[h]:h;if(!j[k])return;if(b){d=c?j[k]:j[k].data;if(d){f.isArray(b)||(b in d?b=[b]:(b=f.camelCase(b),b in d?b=[b]:b=b.split(" ")));for(e=0,g=b.length;e<g;e++)delete d[b[e]];if(!(c?m:f.isEmptyObject)(d))return}}if(!c){delete j[k].data;if(!m(j[k]))return}f.support.deleteExpando||!j.setInterval?delete j[k]:j[k]=null,i&&(f.support.deleteExpando?delete a[h]:a.removeAttribute?a.removeAttribute(h):a[h]=null)}},_data:function(a,b,c){return f.data(a,b,c,!0)},acceptData:function(a){if(a.nodeName){var b=f.noData[a.nodeName.toLowerCase()];if(b)return b!==!0&&a.getAttribute("classid")===b}return!0}}),f.fn.extend({data:function(a,c){var d,e,g,h,i,j=this[0],k=0,m=null;if(a===b){if(this.length){m=f.data(j);if(j.nodeType===1&&!f._data(j,"parsedAttrs")){g=j.attributes;for(i=g.length;k<i;k++)h=g[k].name,h.indexOf("data-")===0&&(h=f.camelCase(h.substring(5)),l(j,h,m[h]));f._data(j,"parsedAttrs",!0)}}return m}if(typeof a=="object")return this.each(function(){f.data(this,a)});d=a.split(".",2),d[1]=d[1]?"."+d[1]:"",e=d[1]+"!";return f.access(this,function(c){if(c===b){m=this.triggerHandler("getData"+e,[d[0]]),m===b&&j&&(m=f.data(j,a),m=l(j,a,m));return m===b&&d[1]?this.data(d[0]):m}d[1]=c,this.each(function(){var b=f(this);b.triggerHandler("setData"+e,d),f.data(this,a,c),b.triggerHandler("changeData"+e,d)})},null,c,arguments.length>1,null,!1)},removeData:function(a){return this.each(function(){f.removeData(this,a)})}}),f.extend({_mark:function(a,b){a&&(b=(b||"fx")+"mark",f._data(a,b,(f._data(a,b)||0)+1))},_unmark:function(a,b,c){a!==!0&&(c=b,b=a,a=!1);if(b){c=c||"fx";var d=c+"mark",e=a?0:(f._data(b,d)||1)-1;e?f._data(b,d,e):(f.removeData(b,d,!0),n(b,c,"mark"))}},queue:function(a,b,c){var d;if(a){b=(b||"fx")+"queue",d=f._data(a,b),c&&(!d||f.isArray(c)?d=f._data(a,b,f.makeArray(c)):d.push(c));return d||[]}},dequeue:function(a,b){b=b||"fx";var c=f.queue(a,b),d=c.shift(),e={};d==="inprogress"&&(d=c.shift()),d&&(b==="fx"&&c.unshift("inprogress"),f._data(a,b+".run",e),d.call(a,function(){f.dequeue(a,b)},e)),c.length||(f.removeData(a,b+"queue "+b+".run",!0),n(a,b,"queue"))}}),f.fn.extend({queue:function(a,c){var d=2;typeof a!="string"&&(c=a,a="fx",d--);if(arguments.length<d)return f.queue(this[0],a);return c===b?this:this.each(function(){var b=f.queue(this,a,c);a==="fx"&&b[0]!=="inprogress"&&f.dequeue(this,a)})},dequeue:function(a){return this.each(function(){f.dequeue(this,a)})},delay:function(a,b){a=f.fx?f.fx.speeds[a]||a:a,b=b||"fx";return this.queue(b,function(b,c){var d=setTimeout(b,a);c.stop=function(){clearTimeout(d)}})},clearQueue:function(a){return this.queue(a||"fx",[])},promise:function(a,c){function m(){--h||d.resolveWith(e,[e])}typeof a!="string"&&(c=a,a=b),a=a||"fx";var d=f.Deferred(),e=this,g=e.length,h=1,i=a+"defer",j=a+"queue",k=a+"mark",l;while(g--)if(l=f.data(e[g],i,b,!0)||(f.data(e[g],j,b,!0)||f.data(e[g],k,b,!0))&&f.data(e[g],i,f.Callbacks("once memory"),!0))h++,l.add(m);m();return d.promise(c)}});var o=/[\n\t\r]/g,p=/\s+/,q=/\r/g,r=/^(?:button|input)$/i,s=/^(?:button|input|object|select|textarea)$/i,t=/^a(?:rea)?$/i,u=/^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,v=f.support.getSetAttribute,w,x,y;f.fn.extend({attr:function(a,b){return f.access(this,f.attr,a,b,arguments.length>1)},removeAttr:function(a){return this.each(function(){f.removeAttr(this,a)})},prop:function(a,b){return f.access(this,f.prop,a,b,arguments.length>1)},removeProp:function(a){a=f.propFix[a]||a;return this.each(function(){try{this[a]=b,delete this[a]}catch(c){}})},addClass:function(a){var b,c,d,e,g,h,i;if(f.isFunction(a))return this.each(function(b){f(this).addClass(a.call(this,b,this.className))});if(a&&typeof a=="string"){b=a.split(p);for(c=0,d=this.length;c<d;c++){e=this[c];if(e.nodeType===1)if(!e.className&&b.length===1)e.className=a;else{g=" "+e.className+" ";for(h=0,i=b.length;h<i;h++)~g.indexOf(" "+b[h]+" ")||(g+=b[h]+" ");e.className=f.trim(g)}}}return this},removeClass:function(a){var c,d,e,g,h,i,j;if(f.isFunction(a))return this.each(function(b){f(this).removeClass(a.call(this,b,this.className))});if(a&&typeof a=="string"||a===b){c=(a||"").split(p);for(d=0,e=this.length;d<e;d++){g=this[d];if(g.nodeType===1&&g.className)if(a){h=(" "+g.className+" ").replace(o," ");for(i=0,j=c.length;i<j;i++)h=h.replace(" "+c[i]+" "," ");g.className=f.trim(h)}else g.className=""}}return this},toggleClass:function(a,b){var c=typeof a,d=typeof b=="boolean";if(f.isFunction(a))return this.each(function(c){f(this).toggleClass(a.call(this,c,this.className,b),b)});return this.each(function(){if(c==="string"){var e,g=0,h=f(this),i=b,j=a.split(p);while(e=j[g++])i=d?i:!h.hasClass(e),h[i?"addClass":"removeClass"](e)}else if(c==="undefined"||c==="boolean")this.className&&f._data(this,"__className__",this.className),this.className=this.className||a===!1?"":f._data(this,"__className__")||""})},hasClass:function(a){var b=" "+a+" ",c=0,d=this.length;for(;c<d;c++)if(this[c].nodeType===1&&(" "+this[c].className+" ").replace(o," ").indexOf(b)>-1)return!0;return!1},val:function(a){var c,d,e,g=this[0];{if(!!arguments.length){e=f.isFunction(a);return this.each(function(d){var g=f(this),h;if(this.nodeType===1){e?h=a.call(this,d,g.val()):h=a,h==null?h="":typeof h=="number"?h+="":f.isArray(h)&&(h=f.map(h,function(a){return a==null?"":a+""})),c=f.valHooks[this.type]||f.valHooks[this.nodeName.toLowerCase()];if(!c||!("set"in c)||c.set(this,h,"value")===b)this.value=h}})}if(g){c=f.valHooks[g.type]||f.valHooks[g.nodeName.toLowerCase()];if(c&&"get"in c&&(d=c.get(g,"value"))!==b)return d;d=g.value;return typeof d=="string"?d.replace(q,""):d==null?"":d}}}}),f.extend({valHooks:{option:{get:function(a){var b=a.attributes.value;return!b||b.specified?a.value:a.text}},select:{get:function(a){var b,c,d,e,g=a.selectedIndex,h=[],i=a.options,j=a.type==="select-one";if(g<0)return null;c=j?g:0,d=j?g+1:i.length;for(;c<d;c++){e=i[c];if(e.selected&&(f.support.optDisabled?!e.disabled:e.getAttribute("disabled")===null)&&(!e.parentNode.disabled||!f.nodeName(e.parentNode,"optgroup"))){b=f(e).val();if(j)return b;h.push(b)}}if(j&&!h.length&&i.length)return f(i[g]).val();return h},set:function(a,b){var c=f.makeArray(b);f(a).find("option").each(function(){this.selected=f.inArray(f(this).val(),c)>=0}),c.length||(a.selectedIndex=-1);return c}}},attrFn:{val:!0,css:!0,html:!0,text:!0,data:!0,width:!0,height:!0,offset:!0},attr:function(a,c,d,e){var g,h,i,j=a.nodeType;if(!!a&&j!==3&&j!==8&&j!==2){if(e&&c in f.attrFn)return f(a)[c](d);if(typeof a.getAttribute=="undefined")return f.prop(a,c,d);i=j!==1||!f.isXMLDoc(a),i&&(c=c.toLowerCase(),h=f.attrHooks[c]||(u.test(c)?x:w));if(d!==b){if(d===null){f.removeAttr(a,c);return}if(h&&"set"in h&&i&&(g=h.set(a,d,c))!==b)return g;a.setAttribute(c,""+d);return d}if(h&&"get"in h&&i&&(g=h.get(a,c))!==null)return g;g=a.getAttribute(c);return g===null?b:g}},removeAttr:function(a,b){var c,d,e,g,h,i=0;if(b&&a.nodeType===1){d=b.toLowerCase().split(p),g=d.length;for(;i<g;i++)e=d[i],e&&(c=f.propFix[e]||e,h=u.test(e),h||f.attr(a,e,""),a.removeAttribute(v?e:c),h&&c in a&&(a[c]=!1))}},attrHooks:{type:{set:function(a,b){if(r.test(a.nodeName)&&a.parentNode)f.error("type property can't be changed");else if(!f.support.radioValue&&b==="radio"&&f.nodeName(a,"input")){var c=a.value;a.setAttribute("type",b),c&&(a.value=c);return b}}},value:{get:function(a,b){if(w&&f.nodeName(a,"button"))return w.get(a,b);return b in a?a.value:null},set:function(a,b,c){if(w&&f.nodeName(a,"button"))return w.set(a,b,c);a.value=b}}},propFix:{tabindex:"tabIndex",readonly:"readOnly","for":"htmlFor","class":"className",maxlength:"maxLength",cellspacing:"cellSpacing",cellpadding:"cellPadding",rowspan:"rowSpan",colspan:"colSpan",usemap:"useMap",frameborder:"frameBorder",contenteditable:"contentEditable"},prop:function(a,c,d){var e,g,h,i=a.nodeType;if(!!a&&i!==3&&i!==8&&i!==2){h=i!==1||!f.isXMLDoc(a),h&&(c=f.propFix[c]||c,g=f.propHooks[c]);return d!==b?g&&"set"in g&&(e=g.set(a,d,c))!==b?e:a[c]=d:g&&"get"in g&&(e=g.get(a,c))!==null?e:a[c]}},propHooks:{tabIndex:{get:function(a){var c=a.getAttributeNode("tabindex");return c&&c.specified?parseInt(c.value,10):s.test(a.nodeName)||t.test(a.nodeName)&&a.href?0:b}}}}),f.attrHooks.tabindex=f.propHooks.tabIndex,x={get:function(a,c){var d,e=f.prop(a,c);return e===!0||typeof e!="boolean"&&(d=a.getAttributeNode(c))&&d.nodeValue!==!1?c.toLowerCase():b},set:function(a,b,c){var d;b===!1?f.removeAttr(a,c):(d=f.propFix[c]||c,d in a&&(a[d]=!0),a.setAttribute(c,c.toLowerCase()));return c}},v||(y={name:!0,id:!0,coords:!0},w=f.valHooks.button={get:function(a,c){var d;d=a.getAttributeNode(c);return d&&(y[c]?d.nodeValue!=="":d.specified)?d.nodeValue:b},set:function(a,b,d){var e=a.getAttributeNode(d);e||(e=c.createAttribute(d),a.setAttributeNode(e));return e.nodeValue=b+""}},f.attrHooks.tabindex.set=w.set,f.each(["width","height"],function(a,b){f.attrHooks[b]=f.extend(f.attrHooks[b],{set:function(a,c){if(c===""){a.setAttribute(b,"auto");return c}}})}),f.attrHooks.contenteditable={get:w.get,set:function(a,b,c){b===""&&(b="false"),w.set(a,b,c)}}),f.support.hrefNormalized||f.each(["href","src","width","height"],function(a,c){f.attrHooks[c]=f.extend(f.attrHooks[c],{get:function(a){var d=a.getAttribute(c,2);return d===null?b:d}})}),f.support.style||(f.attrHooks.style={get:function(a){return a.style.cssText.toLowerCase()||b},set:function(a,b){return a.style.cssText=""+b}}),f.support.optSelected||(f.propHooks.selected=f.extend(f.propHooks.selected,{get:function(a){var b=a.parentNode;b&&(b.selectedIndex,b.parentNode&&b.parentNode.selectedIndex);return null}})),f.support.enctype||(f.propFix.enctype="encoding"),f.support.checkOn||f.each(["radio","checkbox"],function(){f.valHooks[this]={get:function(a){return a.getAttribute("value")===null?"on":a.value}}}),f.each(["radio","checkbox"],function(){f.valHooks[this]=f.extend(f.valHooks[this],{set:function(a,b){if(f.isArray(b))return a.checked=f.inArray(f(a).val(),b)>=0}})});var z=/^(?:textarea|input|select)$/i,A=/^([^\.]*)?(?:\.(.+))?$/,B=/(?:^|\s)hover(\.\S+)?\b/,C=/^key/,D=/^(?:mouse|contextmenu)|click/,E=/^(?:focusinfocus|focusoutblur)$/,F=/^(\w*)(?:#([\w\-]+))?(?:\.([\w\-]+))?$/,G=function(
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           a){var b=F.exec(a);b&&(b[1]=(b[1]||"").toLowerCase(),b[3]=b[3]&&new RegExp("(?:^|\\s)"+b[3]+"(?:\\s|$)"));return b},H=function(a,b){var c=a.attributes||{};return(!b[1]||a.nodeName.toLowerCase()===b[1])&&(!b[2]||(c.id||{}).value===b[2])&&(!b[3]||b[3].test((c["class"]||{}).value))},I=function(a){return f.event.special.hover?a:a.replace(B,"mouseenter$1 mouseleave$1")};f.event={add:function(a,c,d,e,g){var h,i,j,k,l,m,n,o,p,q,r,s;if(!(a.nodeType===3||a.nodeType===8||!c||!d||!(h=f._data(a)))){d.handler&&(p=d,d=p.handler,g=p.selector),d.guid||(d.guid=f.guid++),j=h.events,j||(h.events=j={}),i=h.handle,i||(h.handle=i=function(a){return typeof f!="undefined"&&(!a||f.event.triggered!==a.type)?f.event.dispatch.apply(i.elem,arguments):b},i.elem=a),c=f.trim(I(c)).split(" ");for(k=0;k<c.length;k++){l=A.exec(c[k])||[],m=l[1],n=(l[2]||"").split(".").sort(),s=f.event.special[m]||{},m=(g?s.delegateType:s.bindType)||m,s=f.event.special[m]||{},o=f.extend({type:m,origType:l[1],data:e,handler:d,guid:d.guid,selector:g,quick:g&&G(g),namespace:n.join(".")},p),r=j[m];if(!r){r=j[m]=[],r.delegateCount=0;if(!s.setup||s.setup.call(a,e,n,i)===!1)a.addEventListener?a.addEventListener(m,i,!1):a.attachEvent&&a.attachEvent("on"+m,i)}s.add&&(s.add.call(a,o),o.handler.guid||(o.handler.guid=d.guid)),g?r.splice(r.delegateCount++,0,o):r.push(o),f.event.global[m]=!0}a=null}},global:{},remove:function(a,b,c,d,e){var g=f.hasData(a)&&f._data(a),h,i,j,k,l,m,n,o,p,q,r,s;if(!!g&&!!(o=g.events)){b=f.trim(I(b||"")).split(" ");for(h=0;h<b.length;h++){i=A.exec(b[h])||[],j=k=i[1],l=i[2];if(!j){for(j in o)f.event.remove(a,j+b[h],c,d,!0);continue}p=f.event.special[j]||{},j=(d?p.delegateType:p.bindType)||j,r=o[j]||[],m=r.length,l=l?new RegExp("(^|\\.)"+l.split(".").sort().join("\\.(?:.*\\.)?")+"(\\.|$)"):null;for(n=0;n<r.length;n++)s=r[n],(e||k===s.origType)&&(!c||c.guid===s.guid)&&(!l||l.test(s.namespace))&&(!d||d===s.selector||d==="**"&&s.selector)&&(r.splice(n--,1),s.selector&&r.delegateCount--,p.remove&&p.remove.call(a,s));r.length===0&&m!==r.length&&((!p.teardown||p.teardown.call(a,l)===!1)&&f.removeEvent(a,j,g.handle),delete o[j])}f.isEmptyObject(o)&&(q=g.handle,q&&(q.elem=null),f.removeData(a,["events","handle"],!0))}},customEvent:{getData:!0,setData:!0,changeData:!0},trigger:function(c,d,e,g){if(!e||e.nodeType!==3&&e.nodeType!==8){var h=c.type||c,i=[],j,k,l,m,n,o,p,q,r,s;if(E.test(h+f.event.triggered))return;h.indexOf("!")>=0&&(h=h.slice(0,-1),k=!0),h.indexOf(".")>=0&&(i=h.split("."),h=i.shift(),i.sort());if((!e||f.event.customEvent[h])&&!f.event.global[h])return;c=typeof c=="object"?c[f.expando]?c:new f.Event(h,c):new f.Event(h),c.type=h,c.isTrigger=!0,c.exclusive=k,c.namespace=i.join("."),c.namespace_re=c.namespace?new RegExp("(^|\\.)"+i.join("\\.(?:.*\\.)?")+"(\\.|$)"):null,o=h.indexOf(":")<0?"on"+h:"";if(!e){j=f.cache;for(l in j)j[l].events&&j[l].events[h]&&f.event.trigger(c,d,j[l].handle.elem,!0);return}c.result=b,c.target||(c.target=e),d=d!=null?f.makeArray(d):[],d.unshift(c),p=f.event.special[h]||{};if(p.trigger&&p.trigger.apply(e,d)===!1)return;r=[[e,p.bindType||h]];if(!g&&!p.noBubble&&!f.isWindow(e)){s=p.delegateType||h,m=E.test(s+h)?e:e.parentNode,n=null;for(;m;m=m.parentNode)r.push([m,s]),n=m;n&&n===e.ownerDocument&&r.push([n.defaultView||n.parentWindow||a,s])}for(l=0;l<r.length&&!c.isPropagationStopped();l++)m=r[l][0],c.type=r[l][1],q=(f._data(m,"events")||{})[c.type]&&f._data(m,"handle"),q&&q.apply(m,d),q=o&&m[o],q&&f.acceptData(m)&&q.apply(m,d)===!1&&c.preventDefault();c.type=h,!g&&!c.isDefaultPrevented()&&(!p._default||p._default.apply(e.ownerDocument,d)===!1)&&(h!=="click"||!f.nodeName(e,"a"))&&f.acceptData(e)&&o&&e[h]&&(h!=="focus"&&h!=="blur"||c.target.offsetWidth!==0)&&!f.isWindow(e)&&(n=e[o],n&&(e[o]=null),f.event.triggered=h,e[h](),f.event.triggered=b,n&&(e[o]=n));return c.result}},dispatch:function(c){c=f.event.fix(c||a.event);var d=(f._data(this,"events")||{})[c.type]||[],e=d.delegateCount,g=[].slice.call(arguments,0),h=!c.exclusive&&!c.namespace,i=f.event.special[c.type]||{},j=[],k,l,m,n,o,p,q,r,s,t,u;g[0]=c,c.delegateTarget=this;if(!i.preDispatch||i.preDispatch.call(this,c)!==!1){if(e&&(!c.button||c.type!=="click")){n=f(this),n.context=this.ownerDocument||this;for(m=c.target;m!=this;m=m.parentNode||this)if(m.disabled!==!0){p={},r=[],n[0]=m;for(k=0;k<e;k++)s=d[k],t=s.selector,p[t]===b&&(p[t]=s.quick?H(m,s.quick):n.is(t)),p[t]&&r.push(s);r.length&&j.push({elem:m,matches:r})}}d.length>e&&j.push({elem:this,matches:d.slice(e)});for(k=0;k<j.length&&!c.isPropagationStopped();k++){q=j[k],c.currentTarget=q.elem;for(l=0;l<q.matches.length&&!c.isImmediatePropagationStopped();l++){s=q.matches[l];if(h||!c.namespace&&!s.namespace||c.namespace_re&&c.namespace_re.test(s.namespace))c.data=s.data,c.handleObj=s,o=((f.event.special[s.origType]||{}).handle||s.handler).apply(q.elem,g),o!==b&&(c.result=o,o===!1&&(c.preventDefault(),c.stopPropagation()))}}i.postDispatch&&i.postDispatch.call(this,c);return c.result}},props:"attrChange attrName relatedNode srcElement altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),fixHooks:{},keyHooks:{props:"char charCode key keyCode".split(" "),filter:function(a,b){a.which==null&&(a.which=b.charCode!=null?b.charCode:b.keyCode);return a}},mouseHooks:{props:"button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),filter:function(a,d){var e,f,g,h=d.button,i=d.fromElement;a.pageX==null&&d.clientX!=null&&(e=a.target.ownerDocument||c,f=e.documentElement,g=e.body,a.pageX=d.clientX+(f&&f.scrollLeft||g&&g.scrollLeft||0)-(f&&f.clientLeft||g&&g.clientLeft||0),a.pageY=d.clientY+(f&&f.scrollTop||g&&g.scrollTop||0)-(f&&f.clientTop||g&&g.clientTop||0)),!a.relatedTarget&&i&&(a.relatedTarget=i===a.target?d.toElement:i),!a.which&&h!==b&&(a.which=h&1?1:h&2?3:h&4?2:0);return a}},fix:function(a){if(a[f.expando])return a;var d,e,g=a,h=f.event.fixHooks[a.type]||{},i=h.props?this.props.concat(h.props):this.props;a=f.Event(g);for(d=i.length;d;)e=i[--d],a[e]=g[e];a.target||(a.target=g.srcElement||c),a.target.nodeType===3&&(a.target=a.target.parentNode),a.metaKey===b&&(a.metaKey=a.ctrlKey);return h.filter?h.filter(a,g):a},special:{ready:{setup:f.bindReady},load:{noBubble:!0},focus:{delegateType:"focusin"},blur:{delegateType:"focusout"},beforeunload:{setup:function(a,b,c){f.isWindow(this)&&(this.onbeforeunload=c)},teardown:function(a,b){this.onbeforeunload===b&&(this.onbeforeunload=null)}}},simulate:function(a,b,c,d){var e=f.extend(new f.Event,c,{type:a,isSimulated:!0,originalEvent:{}});d?f.event.trigger(e,null,b):f.event.dispatch.call(b,e),e.isDefaultPrevented()&&c.preventDefault()}},f.event.handle=f.event.dispatch,f.removeEvent=c.removeEventListener?function(a,b,c){a.removeEventListener&&a.removeEventListener(b,c,!1)}:function(a,b,c){a.detachEvent&&a.detachEvent("on"+b,c)},f.Event=function(a,b){if(!(this instanceof f.Event))return new f.Event(a,b);a&&a.type?(this.originalEvent=a,this.type=a.type,this.isDefaultPrevented=a.defaultPrevented||a.returnValue===!1||a.getPreventDefault&&a.getPreventDefault()?K:J):this.type=a,b&&f.extend(this,b),this.timeStamp=a&&a.timeStamp||f.now(),this[f.expando]=!0},f.Event.prototype={preventDefault:function(){this.isDefaultPrevented=K;var a=this.originalEvent;!a||(a.preventDefault?a.preventDefault():a.returnValue=!1)},stopPropagation:function(){this.isPropagationStopped=K;var a=this.originalEvent;!a||(a.stopPropagation&&a.stopPropagation(),a.cancelBubble=!0)},stopImmediatePropagation:function(){this.isImmediatePropagationStopped=K,this.stopPropagation()},isDefaultPrevented:J,isPropagationStopped:J,isImmediatePropagationStopped:J},f.each({mouseenter:"mouseover",mouseleave:"mouseout"},function(a,b){f.event.special[a]={delegateType:b,bindType:b,handle:function(a){var c=this,d=a.relatedTarget,e=a.handleObj,g=e.selector,h;if(!d||d!==c&&!f.contains(c,d))a.type=e.origType,h=e.handler.apply(this,arguments),a.type=b;return h}}}),f.support.submitBubbles||(f.event.special.submit={setup:function(){if(f.nodeName(this,"form"))return!1;f.event.add(this,"click._submit keypress._submit",function(a){var c=a.target,d=f.nodeName(c,"input")||f.nodeName(c,"button")?c.form:b;d&&!d._submit_attached&&(f.event.add(d,"submit._submit",function(a){a._submit_bubble=!0}),d._submit_attached=!0)})},postDispatch:function(a){a._submit_bubble&&(delete a._submit_bubble,this.parentNode&&!a.isTrigger&&f.event.simulate("submit",this.parentNode,a,!0))},teardown:function(){if(f.nodeName(this,"form"))return!1;f.event.remove(this,"._submit")}}),f.support.changeBubbles||(f.event.special.change={setup:function(){if(z.test(this.nodeName)){if(this.type==="checkbox"||this.type==="radio")f.event.add(this,"propertychange._change",function(a){a.originalEvent.propertyName==="checked"&&(this._just_changed=!0)}),f.event.add(this,"click._change",function(a){this._just_changed&&!a.isTrigger&&(this._just_changed=!1,f.event.simulate("change",this,a,!0))});return!1}f.event.add(this,"beforeactivate._change",function(a){var b=a.target;z.test(b.nodeName)&&!b._change_attached&&(f.event.add(b,"change._change",function(a){this.parentNode&&!a.isSimulated&&!a.isTrigger&&f.event.simulate("change",this.parentNode,a,!0)}),b._change_attached=!0)})},handle:function(a){var b=a.target;if(this!==b||a.isSimulated||a.isTrigger||b.type!=="radio"&&b.type!=="checkbox")return a.handleObj.handler.apply(this,arguments)},teardown:function(){f.event.remove(this,"._change");return z.test(this.nodeName)}}),f.support.focusinBubbles||f.each({focus:"focusin",blur:"focusout"},function(a,b){var d=0,e=function(a){f.event.simulate(b,a.target,f.event.fix(a),!0)};f.event.special[b]={setup:function(){d++===0&&c.addEventListener(a,e,!0)},teardown:function(){--d===0&&c.removeEventListener(a,e,!0)}}}),f.fn.extend({on:function(a,c,d,e,g){var h,i;if(typeof a=="object"){typeof c!="string"&&(d=d||c,c=b);for(i in a)this.on(i,c,d,a[i],g);return this}d==null&&e==null?(e=c,d=c=b):e==null&&(typeof c=="string"?(e=d,d=b):(e=d,d=c,c=b));if(e===!1)e=J;else if(!e)return this;g===1&&(h=e,e=function(a){f().off(a);return h.apply(this,arguments)},e.guid=h.guid||(h.guid=f.guid++));return this.each(function(){f.event.add(this,a,e,d,c)})},one:function(a,b,c,d){return this.on(a,b,c,d,1)},off:function(a,c,d){if(a&&a.preventDefault&&a.handleObj){var e=a.handleObj;f(a.delegateTarget).off(e.namespace?e.origType+"."+e.namespace:e.origType,e.selector,e.handler);return this}if(typeof a=="object"){for(var g in a)this.off(g,c,a[g]);return this}if(c===!1||typeof c=="function")d=c,c=b;d===!1&&(d=J);return this.each(function(){f.event.remove(this,a,d,c)})},bind:function(a,b,c){return this.on(a,null,b,c)},unbind:function(a,b){return this.off(a,null,b)},live:function(a,b,c){f(this.context).on(a,this.selector,b,c);return this},die:function(a,b){f(this.context).off(a,this.selector||"**",b);return this},delegate:function(a,b,c,d){return this.on(b,a,c,d)},undelegate:function(a,b,c){return arguments.length==1?this.off(a,"**"):this.off(b,a,c)},trigger:function(a,b){return this.each(function(){f.event.trigger(a,b,this)})},triggerHandler:function(a,b){if(this[0])return f.event.trigger(a,b,this[0],!0)},toggle:function(a){var b=arguments,c=a.guid||f.guid++,d=0,e=function(c){var e=(f._data(this,"lastToggle"+a.guid)||0)%d;f._data(this,"lastToggle"+a.guid,e+1),c.preventDefault();return b[e].apply(this,arguments)||!1};e.guid=c;while(d<b.length)b[d++].guid=c;return this.click(e)},hover:function(a,b){return this.mouseenter(a).mouseleave(b||a)}}),f.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "),function(a,b){f.fn[b]=function(a,c){c==null&&(c=a,a=null);return arguments.length>0?this.on(b,null,a,c):this.trigger(b)},f.attrFn&&(f.attrFn[b]=!0),C.test(b)&&(f.event.fixHooks[b]=f.event.keyHooks),D.test(b)&&(f.event.fixHooks[b]=f.event.mouseHooks)}),function(){function x(a,b,c,e,f,g){for(var h=0,i=e.length;h<i;h++){var j=e[h];if(j){var k=!1;j=j[a];while(j){if(j[d]===c){k=e[j.sizset];break}if(j.nodeType===1){g||(j[d]=c,j.sizset=h);if(typeof b!="string"){if(j===b){k=!0;break}}else if(m.filter(b,[j]).length>0){k=j;break}}j=j[a]}e[h]=k}}}function w(a,b,c,e,f,g){for(var h=0,i=e.length;h<i;h++){var j=e[h];if(j){var k=!1;j=j[a];while(j){if(j[d]===c){k=e[j.sizset];break}j.nodeType===1&&!g&&(j[d]=c,j.sizset=h);if(j.nodeName.toLowerCase()===b){k=j;break}j=j[a]}e[h]=k}}}var a=/((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,d="sizcache"+(Math.random()+"").replace(".",""),e=0,g=Object.prototype.toString,h=!1,i=!0,j=/\\/g,k=/\r\n/g,l=/\W/;[0,0].sort(function(){i=!1;return 0});var m=function(b,d,e,f){e=e||[],d=d||c;var h=d;if(d.nodeType!==1&&d.nodeType!==9)return[];if(!b||typeof b!="string")return e;var i,j,k,l,n,q,r,t,u=!0,v=m.isXML(d),w=[],x=b;do{a.exec(""),i=a.exec(x);if(i){x=i[3],w.push(i[1]);if(i[2]){l=i[3];break}}}while(i);if(w.length>1&&p.exec(b))if(w.length===2&&o.relative[w[0]])j=y(w[0]+w[1],d,f);else{j=o.relative[w[0]]?[d]:m(w.shift(),d);while(w.length)b=w.shift(),o.relative[b]&&(b+=w.shift()),j=y(b,j,f)}else{!f&&w.length>1&&d.nodeType===9&&!v&&o.match.ID.test(w[0])&&!o.match.ID.test(w[w.length-1])&&(n=m.find(w.shift(),d,v),d=n.expr?m.filter(n.expr,n.set)[0]:n.set[0]);if(d){n=f?{expr:w.pop(),set:s(f)}:m.find(w.pop(),w.length===1&&(w[0]==="~"||w[0]==="+")&&d.parentNode?d.parentNode:d,v),j=n.expr?m.filter(n.expr,n.set):n.set,w.length>0?k=s(j):u=!1;while(w.length)q=w.pop(),r=q,o.relative[q]?r=w.pop():q="",r==null&&(r=d),o.relative[q](k,r,v)}else k=w=[]}k||(k=j),k||m.error(q||b);if(g.call(k)==="[object Array]")if(!u)e.push.apply(e,k);else if(d&&d.nodeType===1)for(t=0;k[t]!=null;t++)k[t]&&(k[t]===!0||k[t].nodeType===1&&m.contains(d,k[t]))&&e.push(j[t]);else for(t=0;k[t]!=null;t++)k[t]&&k[t].nodeType===1&&e.push(j[t]);else s(k,e);l&&(m(l,h,e,f),m.uniqueSort(e));return e};m.uniqueSort=function(a){if(u){h=i,a.sort(u);if(h)for(var b=1;b<a.length;b++)a[b]===a[b-1]&&a.splice(b--,1)}return a},m.matches=function(a,b){return m(a,null,null,b)},m.matchesSelector=function(a,b){return m(b,null,null,[a]).length>0},m.find=function(a,b,c){var d,e,f,g,h,i;if(!a)return[];for(e=0,f=o.order.length;e<f;e++){h=o.order[e];if(g=o.leftMatch[h].exec(a)){i=g[1],g.splice(1,1);if(i.substr(i.length-1)!=="\\"){g[1]=(g[1]||"").replace(j,""),d=o.find[h](g,b,c);if(d!=null){a=a.replace(o.match[h],"");break}}}}d||(d=typeof b.getElementsByTagName!="undefined"?b.getElementsByTagName("*"):[]);return{set:d,expr:a}},m.filter=function(a,c,d,e){var f,g,h,i,j,k,l,n,p,q=a,r=[],s=c,t=c&&c[0]&&m.isXML(c[0]);while(a&&c.length){for(h in o.filter)if((f=o.leftMatch[h].exec(a))!=null&&f[2]){k=o.filter[h],l=f[1],g=!1,f.splice(1,1);if(l.substr(l.length-1)==="\\")continue;s===r&&(r=[]);if(o.preFilter[h]){f=o.preFilter[h](f,s,d,r,e,t);if(!f)g=i=!0;else if(f===!0)continue}if(f)for(n=0;(j=s[n])!=null;n++)j&&(i=k(j,f,n,s),p=e^i,d&&i!=null?p?g=!0:s[n]=!1:p&&(r.push(j),g=!0));if(i!==b){d||(s=r),a=a.replace(o.match[h],"");if(!g)return[];break}}if(a===q)if(g==null)m.error(a);else break;q=a}return s},m.error=function(a){throw new Error("Syntax error, unrecognized expression: "+a)};var n=m.getText=function(a){var b,c,d=a.nodeType,e="";if(d){if(d===1||d===9||d===11){if(typeof a.textContent=="string")return a.textContent;if(typeof a.innerText=="string")return a.innerText.replace(k,"");for(a=a.firstChild;a;a=a.nextSibling)e+=n(a)}else if(d===3||d===4)return a.nodeValue}else for(b=0;c=a[b];b++)c.nodeType!==8&&(e+=n(c));return e},o=m.selectors={order:["ID","NAME","TAG"],match:{ID:/#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,CLASS:/\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,NAME:/\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,ATTR:/\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/,TAG:/^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,CHILD:/:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/,POS:/:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,PSEUDO:/:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/},leftMatch:{},attrMap:{"class":"className","for":"htmlFor"},attrHandle:{href:function(a){return a.getAttribute("href")},type:function(a){return a.getAttribute("type")}},relative:{"+":function(a,b){var c=typeof b=="string",d=c&&!l.test(b),e=c&&!d;d&&(b=b.toLowerCase());for(var f=0,g=a.length,h;f<g;f++)if(h=a[f]){while((h=h.previousSibling)&&h.nodeType!==1);a[f]=e||h&&h.nodeName.toLowerCase()===b?h||!1:h===b}e&&m.filter(b,a,!0)},">":function(a,b){var c,d=typeof b=="string",e=0,f=a.length;if(d&&!l.test(b)){b=b.toLowerCase();for(;e<f;e++){c=a[e];if(c){var g=c.parentNode;a[e]=g.nodeName.toLowerCase()===b?g:!1}}}else{for(;e<f;e++)c=a[e],c&&(a[e]=d?c.parentNode:c.parentNode===b);d&&m.filter(b,a,!0)}},"":function(a,b,c){var d,f=e++,g=x;typeof b=="string"&&!l.test(b)&&(b=b.toLowerCase(),d=b,g=w),g("parentNode",b,f,a,d,c)},"~":function(a,b,c){var d,f=e++,g=x;typeof b=="string"&&!l.test(b)&&(b=b.toLowerCase(),d=b,g=w),g("previousSibling",b,f,a,d,c)}},find:{ID:function(a,b,c){if(typeof b.getElementById!="undefined"&&!c){var d=b.getElementById(a[1]);return d&&d.parentNode?[d]:[]}},NAME:function(a,b){if(typeof b.getElementsByName!="undefined"){var c=[],d=b.getElementsByName(a[1]);for(var e=0,f=d.length;e<f;e++)d[e].getAttribute("name")===a[1]&&c.push(d[e]);return c.length===0?null:c}},TAG:function(a,b){if(typeof b.getElementsByTagName!="undefined")return b.getElementsByTagName(a[1])}},preFilter:{CLASS:function(a,b,c,d,e,f){a=" "+a[1].replace(j,"")+" ";if(f)return a;for(var g=0,h;(h=b[g])!=null;g++)h&&(e^(h.className&&(" "+h.className+" ").replace(/[\t\n\r]/g," ").indexOf(a)>=0)?c||d.push(h):c&&(b[g]=!1));return!1},ID:function(a){return a[1].replace(j,"")},TAG:function(a,b){return a[1].replace(j,"").toLowerCase()},CHILD:function(a){if(a[1]==="nth"){a[2]||m.error(a[0]),a[2]=a[2].replace(/^\+|\s*/g,"");var b=/(-?)(\d*)(?:n([+\-]?\d*))?/.exec(a[2]==="even"&&"2n"||a[2]==="odd"&&"2n+1"||!/\D/.test(a[2])&&"0n+"+a[2]||a[2]);a[2]=b[1]+(b[2]||1)-0,a[3]=b[3]-0}else a[2]&&m.error(a[0]);a[0]=e++;return a},ATTR:function(a,b,c,d,e,f){var g=a[1]=a[1].replace(j,"");!f&&o.attrMap[g]&&(a[1]=o.attrMap[g]),a[4]=(a[4]||a[5]||"").replace(j,""),a[2]==="~="&&(a[4]=" "+a[4]+" ");return a},PSEUDO:function(b,c,d,e,f){if(b[1]==="not")if((a.exec(b[3])||"").length>1||/^\w/.test(b[3]))b[3]=m(b[3],null,null,c);else{var g=m.filter(b[3],c,d,!0^f);d||e.push.apply(e,g);return!1}else if(o.match.POS.test(b[0])||o.match.CHILD.test(b[0]))return!0;return b},POS:function(a){a.unshift(!0);return a}},filters:{enabled:function(a){return a.disabled===!1&&a.type!=="hidden"},disabled:function(a){return a.disabled===!0},checked:function(a){return a.checked===!0},selected:function(a){a.parentNode&&a.parentNode.selectedIndex;return a.selected===!0},parent:function(a){return!!a.firstChild},empty:function(a){return!a.firstChild},has:function(a,b,c){return!!m(c[3],a).length},header:function(a){return/h\d/i.test(a.nodeName)},text:function(a){var b=a.getAttribute("type"),c=a.type;return a.nodeName.toLowerCase()==="input"&&"text"===c&&(b===c||b===null)},radio:function(a){return a.nodeName.toLowerCase()==="input"&&"radio"===a.type},checkbox:function(a){return a.nodeName.toLowerCase()==="input"&&"checkbox"===a.type},file:function(a){return a.nodeName.toLowerCase()==="input"&&"file"===a.type},password:function(a){return a.nodeName.toLowerCase()==="input"&&"password"===a.type},submit:function(a){var b=a.nodeName.toLowerCase();return(b==="input"||b==="button")&&"submit"===a.type},image:function(a){return a.nodeName.toLowerCase()==="input"&&"image"===a.type},reset:function(a){var b=a.nodeName.toLowerCase();return(b==="input"||b==="button")&&"reset"===a.type},button:function(a){var b=a.nodeName.toLowerCase();return b==="input"&&"button"===a.type||b==="button"},input:function(a){return/input|select|textarea|button/i.test(a.nodeName)},focus:function(a){return a===a.ownerDocument.activeElement}},setFilters:{first:function(a,b){return b===0},last:function(a,b,c,d){return b===d.length-1},even:function(a,b){return b%2===0},odd:function(a,b){return b%2===1},lt:function(a,b,c){return b<c[3]-0},gt:function(a,b,c){return b>c[3]-0},nth:function(a,b,c){return c[3]-0===b},eq:function(a,b,c){return c[3]-0===b}},filter:{PSEUDO:function(a,b,c,d){var e=b[1],f=o.filters[e];if(f)return f(a,c,b,d);if(e==="contains")return(a.textContent||a.innerText||n([a])||"").indexOf(b[3])>=0;if(e==="not"){var g=b[3];for(var h=0,i=g.length;h<i;h++)if(g[h]===a)return!1;return!0}m.error(e)},CHILD:function(a,b){var c,e,f,g,h,i,j,k=b[1],l=a;switch(k){case"only":case"first":while(l=l.previousSibling)if(l.nodeType===1)return!1;if(k==="first")return!0;l=a;case"last":while(l=l.nextSibling)if(l.nodeType===1)return!1;return!0;case"nth":c=b[2],e=b[3];if(c===1&&e===0)return!0;f=b[0],g=a.parentNode;if(g&&(g[d]!==f||!a.nodeIndex)){i=0;for(l=g.firstChild;l;l=l.nextSibling)l.nodeType===1&&(l.nodeIndex=++i);g[d]=f}j=a.nodeIndex-e;return c===0?j===0:j%c===0&&j/c>=0}},ID:function(a,b){return a.nodeType===1&&a.getAttribute("id")===b},TAG:function(a,b){return b==="*"&&a.nodeType===1||!!a.nodeName&&a.nodeName.toLowerCase()===b},CLASS:function(a,b){return(" "+(a.className||a.getAttribute("class"))+" ").indexOf(b)>-1},ATTR:function(a,b){var c=b[1],d=m.attr?m.attr(a,c):o.attrHandle[c]?o.attrHandle[c](a):a[c]!=null?a[c]:a.getAttribute(c),e=d+"",f=b[2],g=b[4];return d==null?f==="!=":!f&&m.attr?d!=null:f==="="?e===g:f==="*="?e.indexOf(g)>=0:f==="~="?(" "+e+" ").indexOf(g)>=0:g?f==="!="?e!==g:f==="^="?e.indexOf(g)===0:f==="$="?e.substr(e.length-g.length)===g:f==="|="?e===g||e.substr(0,g.length+1)===g+"-":!1:e&&d!==!1},POS:function(a,b,c,d){var e=b[2],f=o.setFilters[e];if(f)return f(a,c,b,d)}}},p=o.match.POS,q=function(a,b){return"\\"+(b-0+1)};for(var r in o.match)o.match[r]=new RegExp(o.match[r].source+/(?![^\[]*\])(?![^\(]*\))/.source),o.leftMatch[r]=new RegExp(/(^(?:.|\r|\n)*?)/.source+o.match[r].source.replace(/\\(\d+)/g,q));o.match.globalPOS=p;var s=function(a,b){a=Array.prototype.slice.call(a,0);if(b){b.push.apply(b,a);return b}return a};try{Array.prototype.slice.call(c.documentElement.childNodes,0)[0].nodeType}catch(t){s=function(a,b){var c=0,d=b||[];if(g.call(a)==="[object Array]")Array.prototype.push.apply(d,a);else if(typeof a.length=="number")for(var e=a.length;c<e;c++)d.push(a[c]);else for(;a[c];c++)d.push(a[c]);return d}}var u,v;c.documentElement.compareDocumentPosition?u=function(a,b){if(a===b){h=!0;return 0}if(!a.compareDocumentPosition||!b.compareDocumentPosition)return a.compareDocumentPosition?-1:1;return a.compareDocumentPosition(b)&4?-1:1}:(u=function(a,b){if(a===b){h=!0;return 0}if(a.sourceIndex&&b.sourceIndex)return a.sourceIndex-b.sourceIndex;var c,d,e=[],f=[],g=a.parentNode,i=b.parentNode,j=g;if(g===i)return v(a,b);if(!g)return-1;if(!i)return 1;while(j)e.unshift(j),j=j.parentNode;j=i;while(j)f.unshift(j),j=j.parentNode;c=e.length,d=f.length;for(var k=0;k<c&&k<d;k++)if(e[k]!==f[k])return v(e[k],f[k]);return k===c?v(a,f[k],-1):v(e[k],b,1)},v=function(a,b,c){if(a===b)return c;var d=a.nextSibling;while(d){if(d===b)return-1;d=d.nextSibling}return 1}),function(){var a=c.createElement("div"),d="script"+(new Date).getTime(),e=c.documentElement;a.innerHTML="<a name='"+d+"'/>",e.insertBefore(a,e.firstChild),c.getElementById(d)&&(o.find.ID=function(a,c,d){if(typeof c.getElementById!="undefined"&&!d){var e=c.getElementById(a[1]);return e?e.id===a[1]||typeof e.getAttributeNode!="undefined"&&e.getAttributeNode("id").nodeValue===a[1]?[e]:b:[]}},o.filter.ID=function(a,b){var c=typeof a.getAttributeNode!="undefined"&&a.getAttributeNode("id");return a.nodeType===1&&c&&c.nodeValue===b}),e.removeChild(a),e=a=null}(),function(){var a=c.createElement("div");a.appendChild(c.createComment("")),a.getElementsByTagName("*").length>0&&(o.find.TAG=function(a,b){var c=b.getElementsByTagName(a[1]);if(a[1]==="*"){var d=[];for(var e=0;c[e];e++)c[e].nodeType===1&&d.push(c[e]);c=d}return c}),a.innerHTML="<a href='#'></a>",a.firstChild&&typeof a.firstChild.getAttribute!="undefined"&&a.firstChild.getAttribute("href")!=="#"&&(o.attrHandle.href=function(a){return a.getAttribute("href",2)}),a=null}(),c.querySelectorAll&&function(){var a=m,b=c.createElement("div"),d="__sizzle__";b.innerHTML="<p class='TEST'></p>";if(!b.querySelectorAll||b.querySelectorAll(".TEST").length!==0){m=function(b,e,f,g){e=e||c;if(!g&&!m.isXML(e)){var h=/^(\w+$)|^\.([\w\-]+$)|^#([\w\-]+$)/.exec(b);if(h&&(e.nodeType===1||e.nodeType===9)){if(h[1])return s(e.getElementsByTagName(b),f);if(h[2]&&o.find.CLASS&&e.getElementsByClassName)return s(e.getElementsByClassName(h[2]),f)}if(e.nodeType===9){if(b==="body"&&e.body)return s([e.body],f);if(h&&h[3]){var i=e.getElementById(h[3]);if(!i||!i.parentNode)return s([],f);if(i.id===h[3])return s([i],f)}try{return s(e.querySelectorAll(b),f)}catch(j){}}else if(e.nodeType===1&&e.nodeName.toLowerCase()!=="object"){var k=e,l=e.getAttribute("id"),n=l||d,p=e.parentNode,q=/^\s*[+~]/.test(b);l?n=n.replace(/'/g,"\\$&"):e.setAttribute("id",n),q&&p&&(e=e.parentNode);try{if(!q||p)return s(e.querySelectorAll("[id='"+n+"'] "+b),f)}catch(r){}finally{l||k.removeAttribute("id")}}}return a(b,e,f,g)};for(var e in a)m[e]=a[e];b=null}}(),function(){var a=c.documentElement,b=a.matchesSelector||a.mozMatchesSelector||a.webkitMatchesSelector||a.msMatchesSelector;if(b){var d=!b.call(c.createElement("div"),"div"),e=!1;try{b.call(c.documentElement,"[test!='']:sizzle")}catch(f){e=!0}m.matchesSelector=function(a,c){c=c.replace(/\=\s*([^'"\]]*)\s*\]/g,"='$1']");if(!m.isXML(a))try{if(e||!o.match.PSEUDO.test(c)&&!/!=/.test(c)){var f=b.call(a,c);if(f||!d||a.document&&a.document.nodeType!==11)return f}}catch(g){}return m(c,null,null,[a]).length>0}}}(),function(){var a=c.createElement("div");a.innerHTML="<div class='test e'></div><div class='test'></div>";if(!!a.getElementsByClassName&&a.getElementsByClassName("e").length!==0){a.lastChild.className="e";if(a.getElementsByClassName("e").length===1)return;o.order.splice(1,0,"CLASS"),o.find.CLASS=function(a,b,c){if(typeof b.getElementsByClassName!="undefined"&&!c)return b.getElementsByClassName(a[1])},a=null}}(),c.documentElement.contains?m.contains=function(a,b){return a!==b&&(a.contains?a.contains(b):!0)}:c.documentElement.compareDocumentPosition?m.contains=function(a,b){return!!(a.compareDocumentPosition(b)&16)}:m.contains=function(){return!1},m.isXML=function(a){var b=(a?a.ownerDocument||a:0).documentElement;return b?b.nodeName!=="HTML":!1};var y=function(a,b,c){var d,e=[],f="",g=b.nodeType?[b]:b;while(d=o.match.PSEUDO.exec(a))f+=d[0],a=a.replace(o.match.PSEUDO,"");a=o.relative[a]?a+"*":a;for(var h=0,i=g.length;h<i;h++)m(a,g[h],e,c);return m.filter(f,e)};m.attr=f.attr,m.selectors.attrMap={},f.find=m,f.expr=m.selectors,f.expr[":"]=f.expr.filters,f.unique=m.uniqueSort,f.text=m.getText,f.isXMLDoc=m.isXML,f.contains=m.contains}();var L=/Until$/,M=/^(?:parents|prevUntil|prevAll)/,N=/,/,O=/^.[^:#\[\.,]*$/,P=Array.prototype.slice,Q=f.expr.match.globalPOS,R={children:!0,contents:!0,next:!0,prev:!0};f.fn.extend({find:function(a){var b=this,c,d;if(typeof a!="string")return f(a).filter(function(){for(c=0,d=b.length;c<d;c++)if(f.contains(b[c],this))return!0});var e=this.pushStack("","find",a),g,h,i;for(c=0,d=this.length;c<d;c++){g=e.length,f.find(a,this[c],e);if(c>0)for(h=g;h<e.length;h++)for(i=0;i<g;i++)if(e[i]===e[h]){e.splice(h--,1);break}}return e},has:function(a){var b=f(a);return this.filter(function(){for(var a=0,c=b.length;a<c;a++)if(f.contains(this,b[a]))return!0})},not:function(a){return this.pushStack(T(this,a,!1),"not",a)},filter:function(a){return this.pushStack(T(this,a,!0),"filter",a)},is:function(a){return!!a&&(typeof a=="string"?Q.test(a)?f(a,this.context).index(this[0])>=0:f.filter(a,this).length>0:this.filter(a).length>0)},closest:function(a,b){var c=[],d,e,g=this[0];if(f.isArray(a)){var h=1;while(g&&g.ownerDocument&&g!==b){for(d=0;d<a.length;d++)f(g).is(a[d])&&c.push({selector:a[d],elem:g,level:h});g=g.parentNode,h++}return c}var i=Q.test(a)||typeof a!="string"?f(a,b||this.context):0;for(d=0,e=this.length;d<e;d++){g=this[d];while(g){if(i?i.index(g)>-1:f.find.matchesSelector(g,a)){c.push(g);break}g=g.parentNode;if(!g||!g.ownerDocument||g===b||g.nodeType===11)break}}c=c.length>1?f.unique(c):c;return this.pushStack(c,"closest",a)},index:function(a){if(!a)return this[0]&&this[0].parentNode?this.prevAll().length:-1;if(typeof a=="string")return f.inArray(this[0],f(a));return f.inArray(a.jquery?a[0]:a,this)},add:function(a,b){var c=typeof a=="string"?f(a,b):f.makeArray(a&&a.nodeType?[a]:a),d=f.merge(this.get(),c);return this.pushStack(S(c[0])||S(d[0])?d:f.unique(d))},andSelf:function(){return this.add(this.prevObject)}}),f.each({parent:function(a){var b=a.parentNode;return b&&b.nodeType!==11?b:null},parents:function(a){return f.dir(a,"parentNode")},parentsUntil:function(a,b,c){return f.dir(a,"parentNode",c)},next:function(a){return f.nth(a,2,"nextSibling")},prev:function(a){return f.nth(a,2,"previousSibling")},nextAll:function(a){return f.dir(a,"nextSibling")},prevAll:function(a){return f.dir(a,"previousSibling")},nextUntil:function(a,b,c){return f.dir(a,"nextSibling",c)},prevUntil:function(a,b,c){return f.dir(a,"previousSibling",c)},siblings:function(a){return f.sibling((a.parentNode||{}).firstChild,a)},children:function(a){return f.sibling(a.firstChild)},contents:function(a){return f.nodeName(a,"iframe")?a.contentDocument||a.contentWindow.document:f.makeArray(a.childNodes)}},function(a,b){f.fn[a]=function(c,d){var e=f.map(this,b,c);L.test(a)||(d=c),d&&typeof d=="string"&&(e=f.filter(d,e)),e=this.length>1&&!R[a]?f.unique(e):e,(this.length>1||N.test(d))&&M.test(a)&&(e=e.reverse());return this.pushStack(e,a,P.call(arguments).join(","))}}),f.extend({filter:function(a,b,c){c&&(a=":not("+a+")");return b.length===1?f.find.matchesSelector(b[0],a)?[b[0]]:[]:f.find.matches(a,b)},dir:function(a,c,d){var e=[],g=a[c];while(g&&g.nodeType!==9&&(d===b||g.nodeType!==1||!f(g).is(d)))g.nodeType===1&&e.push(g),g=g[c];return e},nth:function(a,b,c,d){b=b||1;var e=0;for(;a;a=a[c])if(a.nodeType===1&&++e===b)break;return a},sibling:function(a,b){var c=[];for(;a;a=a.nextSibling)a.nodeType===1&&a!==b&&c.push(a);return c}});var V="abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",W=/ jQuery\d+="(?:\d+|null)"/g,X=/^\s+/,Y=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,Z=/<([\w:]+)/,$=/<tbody/i,_=/<|&#?\w+;/,ba=/<(?:script|style)/i,bb=/<(?:script|object|embed|option|style)/i,bc=new RegExp("<(?:"+V+")[\\s/>]","i"),bd=/checked\s*(?:[^=]|=\s*.checked.)/i,be=/\/(java|ecma)script/i,bf=/^\s*<!(?:\[CDATA\[|\-\-)/,bg={option:[1,"<select multiple='multiple'>","</select>"],legend:[1,"<fieldset>","</fieldset>"],thead:[1,"<table>","</table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],col:[2,"<table><tbody></tbody><colgroup>","</colgroup></table>"],area:[1,"<map>","</map>"],_default:[0,"",""]},bh=U(c);bg.optgroup=bg.option,bg.tbody=bg.tfoot=bg.colgroup=bg.caption=bg.thead,bg.th=bg.td,f.support.htmlSerialize||(bg._default=[1,"div<div>","</div>"]),f.fn.extend({text:function(a){return f.access(this,function(a){return a===b?f.text(this):this.empty().append((this[0]&&this[0].ownerDocument||c).createTextNode(a))},null,a,arguments.length)},wrapAll:function(a){if(f.isFunction(a))return this.each(function(b){f(this).wrapAll(a.call(this,b))});if(this[0]){var b=f(a,this[0].ownerDocument).eq(0).clone(!0);this[0].parentNode&&b.insertBefore(this[0]),b.map(function(){var a=this;while(a.firstChild&&a.firstChild.nodeType===1)a=a.firstChild;return a}).append(this)}return this},wrapInner:function(a){if(f.isFunction(a))return this.each(function(b){f(this).wrapInner(a.call(this,b))});return this.each(function(){var b=f(this),c=b.contents();c.length?c.wrapAll(a):b.append(a)})},wrap:function(a){var b=f.isFunction(a);return this.each(function(c){f(this).wrapAll(b?a.call(this,c):a)})},unwrap:function(){return this.parent().each(function(){f.nodeName(this,"body")||f(this).replaceWith(this.childNodes)}).end()},append:function(){return this.domManip(arguments,!0,function(a){this.nodeType===1&&this.appendChild(a)})},prepend:function(){return this.domManip(arguments,!0,function(a){this.nodeType===1&&this.insertBefore(a,this.firstChild)})},before:function(){if(this[0]&&this[0].parentNode)return this.domManip(arguments,!1,function(a){this.parentNode.insertBefore(a,this)});if(arguments.length){var a=f
    .clean(arguments);a.push.apply(a,this.toArray());return this.pushStack(a,"before",arguments)}},after:function(){if(this[0]&&this[0].parentNode)return this.domManip(arguments,!1,function(a){this.parentNode.insertBefore(a,this.nextSibling)});if(arguments.length){var a=this.pushStack(this,"after",arguments);a.push.apply(a,f.clean(arguments));return a}},remove:function(a,b){for(var c=0,d;(d=this[c])!=null;c++)if(!a||f.filter(a,[d]).length)!b&&d.nodeType===1&&(f.cleanData(d.getElementsByTagName("*")),f.cleanData([d])),d.parentNode&&d.parentNode.removeChild(d);return this},empty:function(){for(var a=0,b;(b=this[a])!=null;a++){b.nodeType===1&&f.cleanData(b.getElementsByTagName("*"));while(b.firstChild)b.removeChild(b.firstChild)}return this},clone:function(a,b){a=a==null?!1:a,b=b==null?a:b;return this.map(function(){return f.clone(this,a,b)})},html:function(a){return f.access(this,function(a){var c=this[0]||{},d=0,e=this.length;if(a===b)return c.nodeType===1?c.innerHTML.replace(W,""):null;if(typeof a=="string"&&!ba.test(a)&&(f.support.leadingWhitespace||!X.test(a))&&!bg[(Z.exec(a)||["",""])[1].toLowerCase()]){a=a.replace(Y,"<$1></$2>");try{for(;d<e;d++)c=this[d]||{},c.nodeType===1&&(f.cleanData(c.getElementsByTagName("*")),c.innerHTML=a);c=0}catch(g){}}c&&this.empty().append(a)},null,a,arguments.length)},replaceWith:function(a){if(this[0]&&this[0].parentNode){if(f.isFunction(a))return this.each(function(b){var c=f(this),d=c.html();c.replaceWith(a.call(this,b,d))});typeof a!="string"&&(a=f(a).detach());return this.each(function(){var b=this.nextSibling,c=this.parentNode;f(this).remove(),b?f(b).before(a):f(c).append(a)})}return this.length?this.pushStack(f(f.isFunction(a)?a():a),"replaceWith",a):this},detach:function(a){return this.remove(a,!0)},domManip:function(a,c,d){var e,g,h,i,j=a[0],k=[];if(!f.support.checkClone&&arguments.length===3&&typeof j=="string"&&bd.test(j))return this.each(function(){f(this).domManip(a,c,d,!0)});if(f.isFunction(j))return this.each(function(e){var g=f(this);a[0]=j.call(this,e,c?g.html():b),g.domManip(a,c,d)});if(this[0]){i=j&&j.parentNode,f.support.parentNode&&i&&i.nodeType===11&&i.childNodes.length===this.length?e={fragment:i}:e=f.buildFragment(a,this,k),h=e.fragment,h.childNodes.length===1?g=h=h.firstChild:g=h.firstChild;if(g){c=c&&f.nodeName(g,"tr");for(var l=0,m=this.length,n=m-1;l<m;l++)d.call(c?bi(this[l],g):this[l],e.cacheable||m>1&&l<n?f.clone(h,!0,!0):h)}k.length&&f.each(k,function(a,b){b.src?f.ajax({type:"GET",global:!1,url:b.src,async:!1,dataType:"script"}):f.globalEval((b.text||b.textContent||b.innerHTML||"").replace(bf,"/*$0*/")),b.parentNode&&b.parentNode.removeChild(b)})}return this}}),f.buildFragment=function(a,b,d){var e,g,h,i,j=a[0];b&&b[0]&&(i=b[0].ownerDocument||b[0]),i.createDocumentFragment||(i=c),a.length===1&&typeof j=="string"&&j.length<512&&i===c&&j.charAt(0)==="<"&&!bb.test(j)&&(f.support.checkClone||!bd.test(j))&&(f.support.html5Clone||!bc.test(j))&&(g=!0,h=f.fragments[j],h&&h!==1&&(e=h)),e||(e=i.createDocumentFragment(),f.clean(a,i,e,d)),g&&(f.fragments[j]=h?e:1);return{fragment:e,cacheable:g}},f.fragments={},f.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(a,b){f.fn[a]=function(c){var d=[],e=f(c),g=this.length===1&&this[0].parentNode;if(g&&g.nodeType===11&&g.childNodes.length===1&&e.length===1){e[b](this[0]);return this}for(var h=0,i=e.length;h<i;h++){var j=(h>0?this.clone(!0):this).get();f(e[h])[b](j),d=d.concat(j)}return this.pushStack(d,a,e.selector)}}),f.extend({clone:function(a,b,c){var d,e,g,h=f.support.html5Clone||f.isXMLDoc(a)||!bc.test("<"+a.nodeName+">")?a.cloneNode(!0):bo(a);if((!f.support.noCloneEvent||!f.support.noCloneChecked)&&(a.nodeType===1||a.nodeType===11)&&!f.isXMLDoc(a)){bk(a,h),d=bl(a),e=bl(h);for(g=0;d[g];++g)e[g]&&bk(d[g],e[g])}if(b){bj(a,h);if(c){d=bl(a),e=bl(h);for(g=0;d[g];++g)bj(d[g],e[g])}}d=e=null;return h},clean:function(a,b,d,e){var g,h,i,j=[];b=b||c,typeof b.createElement=="undefined"&&(b=b.ownerDocument||b[0]&&b[0].ownerDocument||c);for(var k=0,l;(l=a[k])!=null;k++){typeof l=="number"&&(l+="");if(!l)continue;if(typeof l=="string")if(!_.test(l))l=b.createTextNode(l);else{l=l.replace(Y,"<$1></$2>");var m=(Z.exec(l)||["",""])[1].toLowerCase(),n=bg[m]||bg._default,o=n[0],p=b.createElement("div"),q=bh.childNodes,r;b===c?bh.appendChild(p):U(b).appendChild(p),p.innerHTML=n[1]+l+n[2];while(o--)p=p.lastChild;if(!f.support.tbody){var s=$.test(l),t=m==="table"&&!s?p.firstChild&&p.firstChild.childNodes:n[1]==="<table>"&&!s?p.childNodes:[];for(i=t.length-1;i>=0;--i)f.nodeName(t[i],"tbody")&&!t[i].childNodes.length&&t[i].parentNode.removeChild(t[i])}!f.support.leadingWhitespace&&X.test(l)&&p.insertBefore(b.createTextNode(X.exec(l)[0]),p.firstChild),l=p.childNodes,p&&(p.parentNode.removeChild(p),q.length>0&&(r=q[q.length-1],r&&r.parentNode&&r.parentNode.removeChild(r)))}var u;if(!f.support.appendChecked)if(l[0]&&typeof (u=l.length)=="number")for(i=0;i<u;i++)bn(l[i]);else bn(l);l.nodeType?j.push(l):j=f.merge(j,l)}if(d){g=function(a){return!a.type||be.test(a.type)};for(k=0;j[k];k++){h=j[k];if(e&&f.nodeName(h,"script")&&(!h.type||be.test(h.type)))e.push(h.parentNode?h.parentNode.removeChild(h):h);else{if(h.nodeType===1){var v=f.grep(h.getElementsByTagName("script"),g);j.splice.apply(j,[k+1,0].concat(v))}d.appendChild(h)}}}return j},cleanData:function(a){var b,c,d=f.cache,e=f.event.special,g=f.support.deleteExpando;for(var h=0,i;(i=a[h])!=null;h++){if(i.nodeName&&f.noData[i.nodeName.toLowerCase()])continue;c=i[f.expando];if(c){b=d[c];if(b&&b.events){for(var j in b.events)e[j]?f.event.remove(i,j):f.removeEvent(i,j,b.handle);b.handle&&(b.handle.elem=null)}g?delete i[f.expando]:i.removeAttribute&&i.removeAttribute(f.expando),delete d[c]}}}});var bp=/alpha\([^)]*\)/i,bq=/opacity=([^)]*)/,br=/([A-Z]|^ms)/g,bs=/^[\-+]?(?:\d*\.)?\d+$/i,bt=/^-?(?:\d*\.)?\d+(?!px)[^\d\s]+$/i,bu=/^([\-+])=([\-+.\de]+)/,bv=/^margin/,bw={position:"absolute",visibility:"hidden",display:"block"},bx=["Top","Right","Bottom","Left"],by,bz,bA;f.fn.css=function(a,c){return f.access(this,function(a,c,d){return d!==b?f.style(a,c,d):f.css(a,c)},a,c,arguments.length>1)},f.extend({cssHooks:{opacity:{get:function(a,b){if(b){var c=by(a,"opacity");return c===""?"1":c}return a.style.opacity}}},cssNumber:{fillOpacity:!0,fontWeight:!0,lineHeight:!0,opacity:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{"float":f.support.cssFloat?"cssFloat":"styleFloat"},style:function(a,c,d,e){if(!!a&&a.nodeType!==3&&a.nodeType!==8&&!!a.style){var g,h,i=f.camelCase(c),j=a.style,k=f.cssHooks[i];c=f.cssProps[i]||i;if(d===b){if(k&&"get"in k&&(g=k.get(a,!1,e))!==b)return g;return j[c]}h=typeof d,h==="string"&&(g=bu.exec(d))&&(d=+(g[1]+1)*+g[2]+parseFloat(f.css(a,c)),h="number");if(d==null||h==="number"&&isNaN(d))return;h==="number"&&!f.cssNumber[i]&&(d+="px");if(!k||!("set"in k)||(d=k.set(a,d))!==b)try{j[c]=d}catch(l){}}},css:function(a,c,d){var e,g;c=f.camelCase(c),g=f.cssHooks[c],c=f.cssProps[c]||c,c==="cssFloat"&&(c="float");if(g&&"get"in g&&(e=g.get(a,!0,d))!==b)return e;if(by)return by(a,c)},swap:function(a,b,c){var d={},e,f;for(f in b)d[f]=a.style[f],a.style[f]=b[f];e=c.call(a);for(f in b)a.style[f]=d[f];return e}}),f.curCSS=f.css,c.defaultView&&c.defaultView.getComputedStyle&&(bz=function(a,b){var c,d,e,g,h=a.style;b=b.replace(br,"-$1").toLowerCase(),(d=a.ownerDocument.defaultView)&&(e=d.getComputedStyle(a,null))&&(c=e.getPropertyValue(b),c===""&&!f.contains(a.ownerDocument.documentElement,a)&&(c=f.style(a,b))),!f.support.pixelMargin&&e&&bv.test(b)&&bt.test(c)&&(g=h.width,h.width=c,c=e.width,h.width=g);return c}),c.documentElement.currentStyle&&(bA=function(a,b){var c,d,e,f=a.currentStyle&&a.currentStyle[b],g=a.style;f==null&&g&&(e=g[b])&&(f=e),bt.test(f)&&(c=g.left,d=a.runtimeStyle&&a.runtimeStyle.left,d&&(a.runtimeStyle.left=a.currentStyle.left),g.left=b==="fontSize"?"1em":f,f=g.pixelLeft+"px",g.left=c,d&&(a.runtimeStyle.left=d));return f===""?"auto":f}),by=bz||bA,f.each(["height","width"],function(a,b){f.cssHooks[b]={get:function(a,c,d){if(c)return a.offsetWidth!==0?bB(a,b,d):f.swap(a,bw,function(){return bB(a,b,d)})},set:function(a,b){return bs.test(b)?b+"px":b}}}),f.support.opacity||(f.cssHooks.opacity={get:function(a,b){return bq.test((b&&a.currentStyle?a.currentStyle.filter:a.style.filter)||"")?parseFloat(RegExp.$1)/100+"":b?"1":""},set:function(a,b){var c=a.style,d=a.currentStyle,e=f.isNumeric(b)?"alpha(opacity="+b*100+")":"",g=d&&d.filter||c.filter||"";c.zoom=1;if(b>=1&&f.trim(g.replace(bp,""))===""){c.removeAttribute("filter");if(d&&!d.filter)return}c.filter=bp.test(g)?g.replace(bp,e):g+" "+e}}),f(function(){f.support.reliableMarginRight||(f.cssHooks.marginRight={get:function(a,b){return f.swap(a,{display:"inline-block"},function(){return b?by(a,"margin-right"):a.style.marginRight})}})}),f.expr&&f.expr.filters&&(f.expr.filters.hidden=function(a){var b=a.offsetWidth,c=a.offsetHeight;return b===0&&c===0||!f.support.reliableHiddenOffsets&&(a.style&&a.style.display||f.css(a,"display"))==="none"},f.expr.filters.visible=function(a){return!f.expr.filters.hidden(a)}),f.each({margin:"",padding:"",border:"Width"},function(a,b){f.cssHooks[a+b]={expand:function(c){var d,e=typeof c=="string"?c.split(" "):[c],f={};for(d=0;d<4;d++)f[a+bx[d]+b]=e[d]||e[d-2]||e[0];return f}}});var bC=/%20/g,bD=/\[\]$/,bE=/\r?\n/g,bF=/#.*$/,bG=/^(.*?):[ \t]*([^\r\n]*)\r?$/mg,bH=/^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,bI=/^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/,bJ=/^(?:GET|HEAD)$/,bK=/^\/\//,bL=/\?/,bM=/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,bN=/^(?:select|textarea)/i,bO=/\s+/,bP=/([?&])_=[^&]*/,bQ=/^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+))?)?/,bR=f.fn.load,bS={},bT={},bU,bV,bW=["*/"]+["*"];try{bU=e.href}catch(bX){bU=c.createElement("a"),bU.href="",bU=bU.href}bV=bQ.exec(bU.toLowerCase())||[],f.fn.extend({load:function(a,c,d){if(typeof a!="string"&&bR)return bR.apply(this,arguments);if(!this.length)return this;var e=a.indexOf(" ");if(e>=0){var g=a.slice(e,a.length);a=a.slice(0,e)}var h="GET";c&&(f.isFunction(c)?(d=c,c=b):typeof c=="object"&&(c=f.param(c,f.ajaxSettings.traditional),h="POST"));var i=this;f.ajax({url:a,type:h,dataType:"html",data:c,complete:function(a,b,c){c=a.responseText,a.isResolved()&&(a.done(function(a){c=a}),i.html(g?f("<div>").append(c.replace(bM,"")).find(g):c)),d&&i.each(d,[c,b,a])}});return this},serialize:function(){return f.param(this.serializeArray())},serializeArray:function(){return this.map(function(){return this.elements?f.makeArray(this.elements):this}).filter(function(){return this.name&&!this.disabled&&(this.checked||bN.test(this.nodeName)||bH.test(this.type))}).map(function(a,b){var c=f(this).val();return c==null?null:f.isArray(c)?f.map(c,function(a,c){return{name:b.name,value:a.replace(bE,"\r\n")}}):{name:b.name,value:c.replace(bE,"\r\n")}}).get()}}),f.each("ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split(" "),function(a,b){f.fn[b]=function(a){return this.on(b,a)}}),f.each(["get","post"],function(a,c){f[c]=function(a,d,e,g){f.isFunction(d)&&(g=g||e,e=d,d=b);return f.ajax({type:c,url:a,data:d,success:e,dataType:g})}}),f.extend({getScript:function(a,c){return f.get(a,b,c,"script")},getJSON:function(a,b,c){return f.get(a,b,c,"json")},ajaxSetup:function(a,b){b?b$(a,f.ajaxSettings):(b=a,a=f.ajaxSettings),b$(a,b);return a},ajaxSettings:{url:bU,isLocal:bI.test(bV[1]),global:!0,type:"GET",contentType:"application/x-www-form-urlencoded; charset=UTF-8",processData:!0,async:!0,accepts:{xml:"application/xml, text/xml",html:"text/html",text:"text/plain",json:"application/json, text/javascript","*":bW},contents:{xml:/xml/,html:/html/,json:/json/},responseFields:{xml:"responseXML",text:"responseText"},converters:{"* text":a.String,"text html":!0,"text json":f.parseJSON,"text xml":f.parseXML},flatOptions:{context:!0,url:!0}},ajaxPrefilter:bY(bS),ajaxTransport:bY(bT),ajax:function(a,c){function w(a,c,l,m){if(s!==2){s=2,q&&clearTimeout(q),p=b,n=m||"",v.readyState=a>0?4:0;var o,r,u,w=c,x=l?ca(d,v,l):b,y,z;if(a>=200&&a<300||a===304){if(d.ifModified){if(y=v.getResponseHeader("Last-Modified"))f.lastModified[k]=y;if(z=v.getResponseHeader("Etag"))f.etag[k]=z}if(a===304)w="notmodified",o=!0;else try{r=cb(d,x),w="success",o=!0}catch(A){w="parsererror",u=A}}else{u=w;if(!w||a)w="error",a<0&&(a=0)}v.status=a,v.statusText=""+(c||w),o?h.resolveWith(e,[r,w,v]):h.rejectWith(e,[v,w,u]),v.statusCode(j),j=b,t&&g.trigger("ajax"+(o?"Success":"Error"),[v,d,o?r:u]),i.fireWith(e,[v,w]),t&&(g.trigger("ajaxComplete",[v,d]),--f.active||f.event.trigger("ajaxStop"))}}typeof a=="object"&&(c=a,a=b),c=c||{};var d=f.ajaxSetup({},c),e=d.context||d,g=e!==d&&(e.nodeType||e instanceof f)?f(e):f.event,h=f.Deferred(),i=f.Callbacks("once memory"),j=d.statusCode||{},k,l={},m={},n,o,p,q,r,s=0,t,u,v={readyState:0,setRequestHeader:function(a,b){if(!s){var c=a.toLowerCase();a=m[c]=m[c]||a,l[a]=b}return this},getAllResponseHeaders:function(){return s===2?n:null},getResponseHeader:function(a){var c;if(s===2){if(!o){o={};while(c=bG.exec(n))o[c[1].toLowerCase()]=c[2]}c=o[a.toLowerCase()]}return c===b?null:c},overrideMimeType:function(a){s||(d.mimeType=a);return this},abort:function(a){a=a||"abort",p&&p.abort(a),w(0,a);return this}};h.promise(v),v.success=v.done,v.error=v.fail,v.complete=i.add,v.statusCode=function(a){if(a){var b;if(s<2)for(b in a)j[b]=[j[b],a[b]];else b=a[v.status],v.then(b,b)}return this},d.url=((a||d.url)+"").replace(bF,"").replace(bK,bV[1]+"//"),d.dataTypes=f.trim(d.dataType||"*").toLowerCase().split(bO),d.crossDomain==null&&(r=bQ.exec(d.url.toLowerCase()),d.crossDomain=!(!r||r[1]==bV[1]&&r[2]==bV[2]&&(r[3]||(r[1]==="http:"?80:443))==(bV[3]||(bV[1]==="http:"?80:443)))),d.data&&d.processData&&typeof d.data!="string"&&(d.data=f.param(d.data,d.traditional)),bZ(bS,d,c,v);if(s===2)return!1;t=d.global,d.type=d.type.toUpperCase(),d.hasContent=!bJ.test(d.type),t&&f.active++===0&&f.event.trigger("ajaxStart");if(!d.hasContent){d.data&&(d.url+=(bL.test(d.url)?"&":"?")+d.data,delete d.data),k=d.url;if(d.cache===!1){var x=f.now(),y=d.url.replace(bP,"$1_="+x);d.url=y+(y===d.url?(bL.test(d.url)?"&":"?")+"_="+x:"")}}(d.data&&d.hasContent&&d.contentType!==!1||c.contentType)&&v.setRequestHeader("Content-Type",d.contentType),d.ifModified&&(k=k||d.url,f.lastModified[k]&&v.setRequestHeader("If-Modified-Since",f.lastModified[k]),f.etag[k]&&v.setRequestHeader("If-None-Match",f.etag[k])),v.setRequestHeader("Accept",d.dataTypes[0]&&d.accepts[d.dataTypes[0]]?d.accepts[d.dataTypes[0]]+(d.dataTypes[0]!=="*"?", "+bW+"; q=0.01":""):d.accepts["*"]);for(u in d.headers)v.setRequestHeader(u,d.headers[u]);if(d.beforeSend&&(d.beforeSend.call(e,v,d)===!1||s===2)){v.abort();return!1}for(u in{success:1,error:1,complete:1})v[u](d[u]);p=bZ(bT,d,c,v);if(!p)w(-1,"No Transport");else{v.readyState=1,t&&g.trigger("ajaxSend",[v,d]),d.async&&d.timeout>0&&(q=setTimeout(function(){v.abort("timeout")},d.timeout));try{s=1,p.send(l,w)}catch(z){if(s<2)w(-1,z);else throw z}}return v},param:function(a,c){var d=[],e=function(a,b){b=f.isFunction(b)?b():b,d[d.length]=encodeURIComponent(a)+"="+encodeURIComponent(b)};c===b&&(c=f.ajaxSettings.traditional);if(f.isArray(a)||a.jquery&&!f.isPlainObject(a))f.each(a,function(){e(this.name,this.value)});else for(var g in a)b_(g,a[g],c,e);return d.join("&").replace(bC,"+")}}),f.extend({active:0,lastModified:{},etag:{}});var cc=f.now(),cd=/(\=)\?(&|$)|\?\?/i;f.ajaxSetup({jsonp:"callback",jsonpCallback:function(){return f.expando+"_"+cc++}}),f.ajaxPrefilter("json jsonp",function(b,c,d){var e=typeof b.data=="string"&&/^application\/x\-www\-form\-urlencoded/.test(b.contentType);if(b.dataTypes[0]==="jsonp"||b.jsonp!==!1&&(cd.test(b.url)||e&&cd.test(b.data))){var g,h=b.jsonpCallback=f.isFunction(b.jsonpCallback)?b.jsonpCallback():b.jsonpCallback,i=a[h],j=b.url,k=b.data,l="$1"+h+"$2";b.jsonp!==!1&&(j=j.replace(cd,l),b.url===j&&(e&&(k=k.replace(cd,l)),b.data===k&&(j+=(/\?/.test(j)?"&":"?")+b.jsonp+"="+h))),b.url=j,b.data=k,a[h]=function(a){g=[a]},d.always(function(){a[h]=i,g&&f.isFunction(i)&&a[h](g[0])}),b.converters["script json"]=function(){g||f.error(h+" was not called");return g[0]},b.dataTypes[0]="json";return"script"}}),f.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/javascript|ecmascript/},converters:{"text script":function(a){f.globalEval(a);return a}}}),f.ajaxPrefilter("script",function(a){a.cache===b&&(a.cache=!1),a.crossDomain&&(a.type="GET",a.global=!1)}),f.ajaxTransport("script",function(a){if(a.crossDomain){var d,e=c.head||c.getElementsByTagName("head")[0]||c.documentElement;return{send:function(f,g){d=c.createElement("script"),d.async="async",a.scriptCharset&&(d.charset=a.scriptCharset),d.src=a.url,d.onload=d.onreadystatechange=function(a,c){if(c||!d.readyState||/loaded|complete/.test(d.readyState))d.onload=d.onreadystatechange=null,e&&d.parentNode&&e.removeChild(d),d=b,c||g(200,"success")},e.insertBefore(d,e.firstChild)},abort:function(){d&&d.onload(0,1)}}}});var ce=a.ActiveXObject?function(){for(var a in cg)cg[a](0,1)}:!1,cf=0,cg;f.ajaxSettings.xhr=a.ActiveXObject?function(){return!this.isLocal&&ch()||ci()}:ch,function(a){f.extend(f.support,{ajax:!!a,cors:!!a&&"withCredentials"in a})}(f.ajaxSettings.xhr()),f.support.ajax&&f.ajaxTransport(function(c){if(!c.crossDomain||f.support.cors){var d;return{send:function(e,g){var h=c.xhr(),i,j;c.username?h.open(c.type,c.url,c.async,c.username,c.password):h.open(c.type,c.url,c.async);if(c.xhrFields)for(j in c.xhrFields)h[j]=c.xhrFields[j];c.mimeType&&h.overrideMimeType&&h.overrideMimeType(c.mimeType),!c.crossDomain&&!e["X-Requested-With"]&&(e["X-Requested-With"]="XMLHttpRequest");try{for(j in e)h.setRequestHeader(j,e[j])}catch(k){}h.send(c.hasContent&&c.data||null),d=function(a,e){var j,k,l,m,n;try{if(d&&(e||h.readyState===4)){d=b,i&&(h.onreadystatechange=f.noop,ce&&delete cg[i]);if(e)h.readyState!==4&&h.abort();else{j=h.status,l=h.getAllResponseHeaders(),m={},n=h.responseXML,n&&n.documentElement&&(m.xml=n);try{m.text=h.responseText}catch(a){}try{k=h.statusText}catch(o){k=""}!j&&c.isLocal&&!c.crossDomain?j=m.text?200:404:j===1223&&(j=204)}}}catch(p){e||g(-1,p)}m&&g(j,k,m,l)},!c.async||h.readyState===4?d():(i=++cf,ce&&(cg||(cg={},f(a).unload(ce)),cg[i]=d),h.onreadystatechange=d)},abort:function(){d&&d(0,1)}}}});var cj={},ck,cl,cm=/^(?:toggle|show|hide)$/,cn=/^([+\-]=)?([\d+.\-]+)([a-z%]*)$/i,co,cp=[["height","marginTop","marginBottom","paddingTop","paddingBottom"],["width","marginLeft","marginRight","paddingLeft","paddingRight"],["opacity"]],cq;f.fn.extend({show:function(a,b,c){var d,e;if(a||a===0)return this.animate(ct("show",3),a,b,c);for(var g=0,h=this.length;g<h;g++)d=this[g],d.style&&(e=d.style.display,!f._data(d,"olddisplay")&&e==="none"&&(e=d.style.display=""),(e===""&&f.css(d,"display")==="none"||!f.contains(d.ownerDocument.documentElement,d))&&f._data(d,"olddisplay",cu(d.nodeName)));for(g=0;g<h;g++){d=this[g];if(d.style){e=d.style.display;if(e===""||e==="none")d.style.display=f._data(d,"olddisplay")||""}}return this},hide:function(a,b,c){if(a||a===0)return this.animate(ct("hide",3),a,b,c);var d,e,g=0,h=this.length;for(;g<h;g++)d=this[g],d.style&&(e=f.css(d,"display"),e!=="none"&&!f._data(d,"olddisplay")&&f._data(d,"olddisplay",e));for(g=0;g<h;g++)this[g].style&&(this[g].style.display="none");return this},_toggle:f.fn.toggle,toggle:function(a,b,c){var d=typeof a=="boolean";f.isFunction(a)&&f.isFunction(b)?this._toggle.apply(this,arguments):a==null||d?this.each(function(){var b=d?a:f(this).is(":hidden");f(this)[b?"show":"hide"]()}):this.animate(ct("toggle",3),a,b,c);return this},fadeTo:function(a,b,c,d){return this.filter(":hidden").css("opacity",0).show().end().animate({opacity:b},a,c,d)},animate:function(a,b,c,d){function g(){e.queue===!1&&f._mark(this);var b=f.extend({},e),c=this.nodeType===1,d=c&&f(this).is(":hidden"),g,h,i,j,k,l,m,n,o,p,q;b.animatedProperties={};for(i in a){g=f.camelCase(i),i!==g&&(a[g]=a[i],delete a[i]);if((k=f.cssHooks[g])&&"expand"in k){l=k.expand(a[g]),delete a[g];for(i in l)i in a||(a[i]=l[i])}}for(g in a){h=a[g],f.isArray(h)?(b.animatedProperties[g]=h[1],h=a[g]=h[0]):b.animatedProperties[g]=b.specialEasing&&b.specialEasing[g]||b.easing||"swing";if(h==="hide"&&d||h==="show"&&!d)return b.complete.call(this);c&&(g==="height"||g==="width")&&(b.overflow=[this.style.overflow,this.style.overflowX,this.style.overflowY],f.css(this,"display")==="inline"&&f.css(this,"float")==="none"&&(!f.support.inlineBlockNeedsLayout||cu(this.nodeName)==="inline"?this.style.display="inline-block":this.style.zoom=1))}b.overflow!=null&&(this.style.overflow="hidden");for(i in a)j=new f.fx(this,b,i),h=a[i],cm.test(h)?(q=f._data(this,"toggle"+i)||(h==="toggle"?d?"show":"hide":0),q?(f._data(this,"toggle"+i,q==="show"?"hide":"show"),j[q]()):j[h]()):(m=cn.exec(h),n=j.cur(),m?(o=parseFloat(m[2]),p=m[3]||(f.cssNumber[i]?"":"px"),p!=="px"&&(f.style(this,i,(o||1)+p),n=(o||1)/j.cur()*n,f.style(this,i,n+p)),m[1]&&(o=(m[1]==="-="?-1:1)*o+n),j.custom(n,o,p)):j.custom(n,h,""));return!0}var e=f.speed(b,c,d);if(f.isEmptyObject(a))return this.each(e.complete,[!1]);a=f.extend({},a);return e.queue===!1?this.each(g):this.queue(e.queue,g)},stop:function(a,c,d){typeof a!="string"&&(d=c,c=a,a=b),c&&a!==!1&&this.queue(a||"fx",[]);return this.each(function(){function h(a,b,c){var e=b[c];f.removeData(a,c,!0),e.stop(d)}var b,c=!1,e=f.timers,g=f._data(this);d||f._unmark(!0,this);if(a==null)for(b in g)g[b]&&g[b].stop&&b.indexOf(".run")===b.length-4&&h(this,g,b);else g[b=a+".run"]&&g[b].stop&&h(this,g,b);for(b=e.length;b--;)e[b].elem===this&&(a==null||e[b].queue===a)&&(d?e[b](!0):e[b].saveState(),c=!0,e.splice(b,1));(!d||!c)&&f.dequeue(this,a)})}}),f.each({slideDown:ct("show",1),slideUp:ct("hide",1),slideToggle:ct("toggle",1),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(a,b){f.fn[a]=function(a,c,d){return this.animate(b,a,c,d)}}),f.extend({speed:function(a,b,c){var d=a&&typeof a=="object"?f.extend({},a):{complete:c||!c&&b||f.isFunction(a)&&a,duration:a,easing:c&&b||b&&!f.isFunction(b)&&b};d.duration=f.fx.off?0:typeof d.duration=="number"?d.duration:d.duration in f.fx.speeds?f.fx.speeds[d.duration]:f.fx.speeds._default;if(d.queue==null||d.queue===!0)d.queue="fx";d.old=d.complete,d.complete=function(a){f.isFunction(d.old)&&d.old.call(this),d.queue?f.dequeue(this,d.queue):a!==!1&&f._unmark(this)};return d},easing:{linear:function(a){return a},swing:function(a){return-Math.cos(a*Math.PI)/2+.5}},timers:[],fx:function(a,b,c){this.options=b,this.elem=a,this.prop=c,b.orig=b.orig||{}}}),f.fx.prototype={update:function(){this.options.step&&this.options.step.call(this.elem,this.now,this),(f.fx.step[this.prop]||f.fx.step._default)(this)},cur:function(){if(this.elem[this.prop]!=null&&(!this.elem.style||this.elem.style[this.prop]==null))return this.elem[this.prop];var a,b=f.css(this.elem,this.prop);return isNaN(a=parseFloat(b))?!b||b==="auto"?0:b:a},custom:function(a,c,d){function h(a){return e.step(a)}var e=this,g=f.fx;this.startTime=cq||cr(),this.end=c,this.now=this.start=a,this.pos=this.state=0,this.unit=d||this.unit||(f.cssNumber[this.prop]?"":"px"),h.queue=this.options.queue,h.elem=this.elem,h.saveState=function(){f._data(e.elem,"fxshow"+e.prop)===b&&(e.options.hide?f._data(e.elem,"fxshow"+e.prop,e.start):e.options.show&&f._data(e.elem,"fxshow"+e.prop,e.end))},h()&&f.timers.push(h)&&!co&&(co=setInterval(g.tick,g.interval))},show:function(){var a=f._data(this.elem,"fxshow"+this.prop);this.options.orig[this.prop]=a||f.style(this.elem,this.prop),this.options.show=!0,a!==b?this.custom(this.cur(),a):this.custom(this.prop==="width"||this.prop==="height"?1:0,this.cur()),f(this.elem).show()},hide:function(){this.options.orig[this.prop]=f._data(this.elem,"fxshow"+this.prop)||f.style(this.elem,this.prop),this.options.hide=!0,this.custom(this.cur(),0)},step:function(a){var b,c,d,e=cq||cr(),g=!0,h=this.elem,i=this.options;if(a||e>=i.duration+this.startTime){this.now=this.end,this.pos=this.state=1,this.update(),i.animatedProperties[this.prop]=!0;for(b in i.animatedProperties)i.animatedProperties[b]!==!0&&(g=!1);if(g){i.overflow!=null&&!f.support.shrinkWrapBlocks&&f.each(["","X","Y"],function(a,b){h.style["overflow"+b]=i.overflow[a]}),i.hide&&f(h).hide();if(i.hide||i.show)for(b in i.animatedProperties)f.style(h,b,i.orig[b]),f.removeData(h,"fxshow"+b,!0),f.removeData(h,"toggle"+b,!0);d=i.complete,d&&(i.complete=!1,d.call(h))}return!1}i.duration==Infinity?this.now=e:(c=e-this.startTime,this.state=c/i.duration,this.pos=f.easing[i.animatedProperties[this.prop]](this.state,c,0,1,i.duration),this.now=this.start+(this.end-this.start)*this.pos),this.update();return!0}},f.extend(f.fx,{tick:function(){var a,b=f.timers,c=0;for(;c<b.length;c++)a=b[c],!a()&&b[c]===a&&b.splice(c--,1);b.length||f.fx.stop()},interval:13,stop:function(){clearInterval(co),co=null},speeds:{slow:600,fast:200,_default:400},step:{opacity:function(a){f.style(a.elem,"opacity",a.now)},_default:function(a){a.elem.style&&a.elem.style[a.prop]!=null?a.elem.style[a.prop]=a.now+a.unit:a.elem[a.prop]=a.now}}}),f.each(cp.concat.apply([],cp),function(a,b){b.indexOf("margin")&&(f.fx.step[b]=function(a){f.style(a.elem,b,Math.max(0,a.now)+a.unit)})}),f.expr&&f.expr.filters&&(f.expr.filters.animated=function(a){return f.grep(f.timers,function(b){return a===b.elem}).length});var cv,cw=/^t(?:able|d|h)$/i,cx=/^(?:body|html)$/i;"getBoundingClientRect"in c.documentElement?cv=function(a,b,c,d){try{d=a.getBoundingClientRect()}catch(e){}if(!d||!f.contains(c,a))return d?{top:d.top,left:d.left}:{top:0,left:0};var g=b.body,h=cy(b),i=c.clientTop||g.clientTop||0,j=c.clientLeft||g.clientLeft||0,k=h.pageYOffset||f.support.boxModel&&c.scrollTop||g.scrollTop,l=h.pageXOffset||f.support.boxModel&&c.scrollLeft||g.scrollLeft,m=d.top+k-i,n=d.left+l-j;return{top:m,left:n}}:cv=function(a,b,c){var d,e=a.offsetParent,g=a,h=b.body,i=b.defaultView,j=i?i.getComputedStyle(a,null):a.currentStyle,k=a.offsetTop,l=a.offsetLeft;while((a=a.parentNode)&&a!==h&&a!==c){if(f.support.fixedPosition&&j.position==="fixed")break;d=i?i.getComputedStyle(a,null):a.currentStyle,k-=a.scrollTop,l-=a.scrollLeft,a===e&&(k+=a.offsetTop,l+=a.offsetLeft,f.support.doesNotAddBorder&&(!f.support.doesAddBorderForTableAndCells||!cw.test(a.nodeName))&&(k+=parseFloat(d.borderTopWidth)||0,l+=parseFloat(d.borderLeftWidth)||0),g=e,e=a.offsetParent),f.support.subtractsBorderForOverflowNotVisible&&d.overflow!=="visible"&&(k+=parseFloat(d.borderTopWidth)||0,l+=parseFloat(d.borderLeftWidth)||0),j=d}if(j.position==="relative"||j.position==="static")k+=h.offsetTop,l+=h.offsetLeft;f.support.fixedPosition&&j.position==="fixed"&&(k+=Math.max(c.scrollTop,h.scrollTop),l+=Math.max(c.scrollLeft,h.scrollLeft));return{top:k,left:l}},f.fn.offset=function(a){if(arguments.length)return a===b?this:this.each(function(b){f.offset.setOffset(this,a,b)});var c=this[0],d=c&&c.ownerDocument;if(!d)return null;if(c===d.body)return f.offset.bodyOffset(c);return cv(c,d,d.documentElement)},f.offset={bodyOffset:function(a){var b=a.offsetTop,c=a.offsetLeft;f.support.doesNotIncludeMarginInBodyOffset&&(b+=parseFloat(f.css(a,"marginTop"))||0,c+=parseFloat(f.css(a,"marginLeft"))||0);return{top:b,left:c}},setOffset:function(a,b,c){var d=f.css(a,"position");d==="static"&&(a.style.position="relative");var e=f(a),g=e.offset(),h=f.css(a,"top"),i=f.css(a,"left"),j=(d==="absolute"||d==="fixed")&&f.inArray("auto",[h,i])>-1,k={},l={},m,n;j?(l=e.position(),m=l.top,n=l.left):(m=parseFloat(h)||0,n=parseFloat(i)||0),f.isFunction(b)&&(b=b.call(a,c,g)),b.top!=null&&(k.top=b.top-g.top+m),b.left!=null&&(k.left=b.left-g.left+n),"using"in b?b.using.call(a,k):e.css(k)}},f.fn.extend({position:function(){if(!this[0])return null;var a=this[0],b=this.offsetParent(),c=this.offset(),d=cx.test(b[0].nodeName)?{top:0,left:0}:b.offset();c.top-=parseFloat(f.css(a,"marginTop"))||0,c.left-=parseFloat(f.css(a,"marginLeft"))||0,d.top+=parseFloat(f.css(b[0],"borderTopWidth"))||0,d.left+=parseFloat(f.css(b[0],"borderLeftWidth"))||0;return{top:c.top-d.top,left:c.left-d.left}},offsetParent:function(){return this.map(function(){var a=this.offsetParent||c.body;while(a&&!cx.test(a.nodeName)&&f.css(a,"position")==="static")a=a.offsetParent;return a})}}),f.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(a,c){var d=/Y/.test(c);f.fn[a]=function(e){return f.access(this,function(a,e,g){var h=cy(a);if(g===b)return h?c in h?h[c]:f.support.boxModel&&h.document.documentElement[e]||h.document.body[e]:a[e];h?h.scrollTo(d?f(h).scrollLeft():g,d?g:f(h).scrollTop()):a[e]=g},a,e,arguments.length,null)}}),f.each({Height:"height",Width:"width"},function(a,c){var d="client"+a,e="scroll"+a,g="offset"+a;f.fn["inner"+a]=function(){var a=this[0];return a?a.style?parseFloat(f.css(a,c,"padding")):this[c]():null},f.fn["outer"+a]=function(a){var b=this[0];return b?b.style?parseFloat(f.css(b,c,a?"margin":"border")):this[c]():null},f.fn[c]=function(a){return f.access(this,function(a,c,h){var i,j,k,l;if(f.isWindow(a)){i=a.document,j=i.documentElement[d];return f.support.boxModel&&j||i.body&&i.body[d]||j}if(a.nodeType===9){i=a.documentElement;if(i[d]>=i[e])return i[d];return Math.max(a.body[e],i[e],a.body[g],i[g])}if(h===b){k=f.css(a,c),l=parseFloat(k);return f.isNumeric(l)?l:k}f(a).css(c,h)},c,a,arguments.length,null)}}),a.jQuery=a.$=f,typeof define=="function"&&define.amd&&define.amd.jQuery&&define("jquery",[],function(){return f})})(window); 






// run it
main();


