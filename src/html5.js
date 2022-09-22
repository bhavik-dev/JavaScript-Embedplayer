(function ($, undefined) {
	function play(event) {
		var data = $.data(this, 'embedplayer');
		$.embedplayer.trigger(this, data, 'play');
	}

	function pause(event) {
		var data = $.data(this, 'embedplayer');
		$.embedplayer.trigger(this, data, 'pause');
	}

	function ended(event) {
		var data = $.data(this, 'embedplayer');
		$.embedplayer.trigger(this, data, 'finish');
	}

	function waiting(event) {
		var data = $.data(this, 'embedplayer');
		$.embedplayer.trigger(this, data, 'buffering');
	}

	function timeupdate(event) {
		var data = $.data(this, 'embedplayer');
		$.embedplayer.trigger(this, data, 'timeupdate', {currentTime:this.currentTime});
	}

	function volumechange(event) {
		var data = $.data(this, 'embedplayer');
		$.embedplayer.trigger(this, data, 'volumechange', {volume:this.volume});
	}

	function durationchange(event) {
		var data = $.data(this, 'embedplayer');
		$.embedplayer.trigger(this, data, 'durationchange', {duration:this.duration});
	}

	function error(event) {
		var data = $.data(this, 'embedplayer');
		var error = 'error';
		if (this.error) {
			switch (this.error.code) {
				case MediaError.MEDIA_ERR_ABORTED:
					error = 'aborted';
					break;

				case MediaError.MEDIA_ERR_NETWORK:
					error = 'network_error';
					break;

				case MediaError.MEDIA_ERR_DECODE:
					error = 'decoding_error';
					break;

				case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
					error = 'src_not_supported';
					break;
			}
		}
		$.embedplayer.trigger(this, data, 'error', {
			error: error
		});
	}

	function loadedmetadata(event) {
		var data = $.data(this, 'embedplayer');
		this.removeEventListener('loadedmetadata', loadedmetadata, false);
		$.embedplayer.trigger(this, data, 'ready');
	}

	$.embedplayer.register({
		matches: function () {
			return $.nodeName(this, 'video') || $.nodeName(this, 'audio');
		},
		init: function (data, callback) {
			if (this.readyState === HTMLMediaElement.HAVE_METADATA) {
				var self = this;
				setTimeout(function () {
					$.embedplayer.trigger(self, data, 'ready');
				}, 0);
			}
			else {
				this.addEventListener('loadedmetadata', loadedmetadata, false);
			}

			// initialize volume and duration
			$.embedplayer.trigger(this, data, 'volumechange', {volume:this.volume});
			if (!isNaN(this.duration)) {
				$.embedplayer.trigger(this, data, 'durationchange', {duration:this.duration});
			}

			callback();

			this.addEventListener('play', play, false);
			this.addEventListener('pause', pause, false);
			this.addEventListener('ended', ended, false);
			this.addEventListener('waiting', waiting, false);
			this.addEventListener('timeupdate', timeupdate, false);
			this.addEventListener('volumechange', volumechange, false);
			this.addEventListener('durationchange', durationchange, false);
			this.addEventListener('error', error, false);
		},
		play: function (data) {
			this.play();
		},
		pause: function (data) {
			this.pause();
		},
		toggle: function (data) {
			if (this.paused) {
				this.play();
			}
			else {
				this.pause();
			}
		},
		stop: function (data) {
			this.pause();
			this.currentTime = 0;
		},
		volume: function (data, callback) {
			callback(this.volume);
		},
		duration: function (data, callback) {
			callback(this.duration);
		},
		currenttime: function (data, callback) {
			callback(this.currentTime);
		},
		setVolume: function (data, volume) {
			this.volume = Number(volume);
		},
		seek: function (data, position) {
			this.currentTime = Number(position);
		}
	});
})(jQuery);
