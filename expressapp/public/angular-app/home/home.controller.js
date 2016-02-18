(function() {
	'use strict';

	angular
		.module('app.home')
		.controller('HomeCtrl', HomeCtrl);

	function HomeCtrl($rootScope, $scope, $document, $uibModal, dataservice) {
		var vm = this;
		var modalInstance = null;
		var movieList = [];
		var auth2 = null;
		vm.listTM = [];
		vm.listBO = [];
		vm.selectedMovie = null;
		vm.prevMovie = null;
		vm.nextMovie = null;
		vm.isLogged = false;

		vm.scrollToElmt = scrollToElmt;
		vm.viewMovieDetail = viewMovieDetail;
		vm.closeDialog = closeDialog;
		vm.testSignOut = testSignOut;

		activate();
		function activate() {
			var promise = [dataservice.getLatestBoxOffice, dataservice.getLatestTopMovie];
			dataservice.ready(promise).then(afterGetResult);

			loadGoogleAPI();
		}

		function loadGoogleAPI() {
			gapi.load('auth2', function() {
				auth2 = gapi.auth2.init({
					client_id: '282630936768-vh37jnihfbm59s8jmkrr4eu7hl577r8r.apps.googleusercontent.com',
					cookiepolicy: 'single_host_origin'
				});
				auth2.attachClickHandler(document.getElementById('google-signin-btn1'));
				auth2.isSignedIn.listen(googleSignedListener);

				function googleSignedListener(isLogged) {
					if (isLogged) {
						$scope.$apply(function() {
							vm.isLogged = true;
						});

						var profile = auth2.currentUser.get().getBasicProfile();
						console.log('ID: ' + profile.getId());
						console.log('Name: ' + profile.getName());
						console.log('Image URL: ' + profile.getImageUrl());
						console.log('Email: ' + profile.getEmail());
					}
				}
			});
		}

		function afterSuccessSignin() {
		}

		function testSignOut() {
			vm.isLogged = false;

			auth2.signOut().then(function() {
				console.log('User signed out.');
			});
		}

		function viewMovieDetail(movieId) {
			closeDialog();
			findMovie(movieId);
			modalInstance = $uibModal.open({
				templateUrl: 'movieDetail.html',
				scope: $scope,
				size: 'lg',
				backdrop: 'static'
			});

			modalInstance.rendered.then(function() {
				if (auth2 && auth2.attachClickHandler)
					auth2.attachClickHandler(document.getElementById('google-signin-btn2'));
			});
		}

		function findMovie(movieId) {
			var prev;
			var next;
			var index;

			_.forEach(movieList, function(d, i) {
				if (movieId === d.imdbID) {
					vm.selectedMovie = d;
					index = i;
				}
			});

			prev = index - 1;
			next = index + 1;

			prev = (prev === -1) ? movieList.length - 1 : prev;
			next = (next >= movieList.length) ? 0 : next;

			vm.prevMovie = movieList[prev];
			vm.nextMovie = movieList[next];
		}

		function closeDialog() {
			if (modalInstance && modalInstance.dismiss)
				modalInstance.dismiss();
		}

		function afterGetResult(result) {
			afterGetLatestBO(result[0]);
			afterGetLatestTM(result[1]);
		}

		function afterGetLatestTM(result) {
			vm.listTM = _.slice(result, 0, 5);
			addToMovieList(vm.listTM);
		}

		function afterGetLatestBO(result) {
			vm.listBO[0] = _.slice(result, 0, 3);
			addToMovieList(vm.listBO[0]);
			vm.listBO[1] = _.slice(result, 3, 6);
			addToMovieList(vm.listBO[1]);
			vm.listBO[2] = _.slice(result, 6, 9);
			addToMovieList(vm.listBO[2]);
		}

		function addToMovieList(result) {
			_.forEach(result, function(d) {
				movieList.push(d);
			});
		}

		function scrollToElmt(elmtId) {
			$document.scrollToElementAnimated(angular.element(document.getElementById(elmtId)), 0, 700);
		}
	}

})();
