(function() {
	var inf = 'Fri, 31 Dec 9999 23:59:59 GMT'
	var min = 'Thu, 01 Jan 1970 00:00:00 GMT'
	
	function get(key) {
		return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(key).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
	}
	
	function set(key, value, expires) {
		document.cookie = encodeURIComponent(key) + "=" + encodeURIComponent(value) + expires;
		return true
	}
	
	function unset(key) {
		var expires = ';expires=' + min
		return set(key, '', expires)
	}
	
	function cookie(key, value, ttl) {
		if (key === undefined) {
			// possibly implement list later if needed
			return null
		} else if (value === undefined) {
			return get(key)
		} else if (value === null) {
			return unset(key)
		} else {
			var expires = ''
			if (ttl) {
				switch (ttl.constructor) {
					case Number:
						expires = ttl === Infinity ? ';expires=' + inf : ';max-age=' + ttl
						break
					case String:
						expires = ';expires=' + ttl
						break
					case Date:
						expires = ';expires=' + ttl.toUTCString()
						break
				}
			}
			return set(key, value, expires)
		}
	}
	
	cookie.attach = function(obj) {
		obj.cookie = cookie
		delete window.cookie
	}
	
	window.cookie = cookie
}())