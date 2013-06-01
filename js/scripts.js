// Carbon
var z = document.createElement('script');
z.async = z.src = '//engine.carbonads.com/z/20676/azcarbon_2_1_0_HORIZDARK';
var s = document.getElementsByTagName('script')[0];
s.parentNode.insertBefore(z, s);

// Twitter Follow
!function(d,s,id){
	var js,fjs=d.getElementsByTagName(s)[0];
	if(!d.getElementById(id)){js=d.createElement(s);js.id=id;
	js.src='//platform.twitter.com/widgets.js';
	fjs.parentNode.insertBefore(js,fjs);
}}(document,'script','twitter-wjs');

// Facebook Like
(function(d, s, id) {
	var js, fjs = d.getElementsByTagName(s)[0];
	if (d.getElementById(id)) return;
	js = d.createElement(s); js.id = id;
	js.src = "//connect.facebook.net/en_GB/all.js#xfbml=1&appId=252993844735607";
	fjs.parentNode.insertBefore(js, fjs);
})(document, 'script', 'facebook-jssdk');

// Sharing: Facebook, Twitter, Google+
(function(doc,s) {
    var js, fjs = doc.getElementsByTagName(s)[0],
        frag = doc.createDocumentFragment(),
        add = function (url, id) {
            if (doc.getElementById(id)) {
                return;
            }
            js = doc.createElement(s);
            js.src = url;
            id && (js.id = id);
            frag.appendChild(js);
        };
    add('http://connect.facebook.net/en_US/all.js#xfbml=1','facebook-jssdk');
    add('http://platform.twitter.com/widgets.js');
    add('https://apis.google.com/js/plusone.js');
    fjs.parentNode.insertBefore(frag, fjs);
})(document,'script');