'use strict';
/** 
 * controller for AngularJS-Toaster
 */
app.controller('notesCtrl', ["$scope", "UQUser", "UserNote", "$localStorage", "cfpLoadingBar", "$state", "$timeout", "SweetAlert", "$window",

    function($scope, UQUser, UserNote, $localStorage, cfpLoadingBar, $state, $timeout, SweetAlert, $window) {
        var fetchNote = function() {
            UQUser.userNotes({
                id: $localStorage.user.id
            }, function(res) {
                $scope.htmlVariable = res.html;
                $scope.savedHTML = res.html;
            }, function(err) {
                $scope.htmlVariable = null;
                $scope.savedHTML = null;
            })
        };
        fetchNote();
        $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
            if (fromState.name == 'app.ui.notes' && $scope.htmlVariable != $scope.savedHTML) {
                event.preventDefault();
                cfpLoadingBar.complete();
                cfpLoadingBar.set(0.0);
                SweetAlert.swal({
                    title: "Are you sure?",
                    text: "Your have unsaved changes",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#007AFF",
                    confirmButtonText: "Save and go",
                    cancelButtonText: "Continue Editing",
                    closeOnConfirm: true,
                    closeOnCancel: true
                }, function(isConfirm) {
                    if (isConfirm) {
                        $scope.saveNotes();
                        $timeout(function() {
                            $state.go('app.dashboard');
                        }, 1000);
                    }
                });
                //console.log(event.currentScope.htmlVariable);
            }
        });


        $scope.deleteNote = function() {
            UQUser.userNotes.destroy({
                id: $localStorage.user.id
            }, function(res) {

                fetchNote();
            }, function(err) {
                $scope.htmlVariable = null;
                $scope.savedHTML = null;
            });

        }
        $scope.saveNotes = function() {
            //console.log($scope.htmlVariable);
            UserNote.findOne({
                filter: {
                    where: {
                        uQUserId: $localStorage.user.id
                    }
                }
            }, function(res) {
                //update the user notes
                UQUser.userNotes.update({
                    id: $localStorage.user.id
                }, {
                    html: $scope.htmlVariable
                }, function(res) {
                    //console.log(res);
                    $scope.savedHTML = res.html;
                });
            }, function(err) {
                if (err.statusText == 'Not Found') {
                    console.log('no model found.Create a new one');
                    UQUser.userNotes.create({
                        id: $localStorage.user.id
                    }, {
                        html: $scope.htmlVariable
                    }, function(res) {
                        $scope.savedHTML = res.html;
                        //console.log(res);
                    })
                }
            })

        }
    }

]);