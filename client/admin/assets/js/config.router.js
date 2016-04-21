'use strict';

/**
 * Config for the router
 */
app.config(['$stateProvider', '$urlRouterProvider', '$controllerProvider', '$compileProvider', '$filterProvider', '$provide', '$ocLazyLoadProvider', 'JS_REQUIRES',
    function($stateProvider, $urlRouterProvider, $controllerProvider, $compileProvider, $filterProvider, $provide, $ocLazyLoadProvider, jsRequires) {

        app.controller = $controllerProvider.register;
        app.directive = $compileProvider.directive;
        app.filter = $filterProvider.register;
        app.factory = $provide.factory;
        app.service = $provide.service;
        app.constant = $provide.constant;
        app.value = $provide.value;

        // LAZY MODULES

        $ocLazyLoadProvider.config({
            debug: false,
            events: true,
            modules: jsRequires.modules
        });

        // APPLICATION ROUTES
        // -----------------------------------

        //
        // Set up the states
        $stateProvider.state('app', {
            url: "/app",
            templateUrl: "assets/views/app.html",
            resolve: loadSequence('perfect-scrollbar-plugin', 'spin', 'angularSpinner', 'vAccordion', 'sweet-alert', 'chartjs', 'tc.chartjs', 'oitozero.ngSweetAlert', 'chatCtrl'),
            abstract: true
        }).state('app.dashboard', {
            url: "/dashboard",
            templateUrl: "assets/views/dashboard.html",
            resolve: loadSequence('moment', 'angularMoment', 'dashboardCtrl'),
            title: 'Dashboard',
            ncyBreadcrumb: {
                label: 'Dashboard'
            },
            data: {
                permissions: {
                    only: ['admin'],
                    redirectTo: 'login.signin'
                }
            }
        }).state('app.ui', {
            url: '/ui',
            template: '<div ui-view class="fade-in-up"></div>',
            title: 'UI Elements',
            ncyBreadcrumb: {
                label: 'UI Elements'
            }
        }).state('app.ui.notes', {
            url: '/notes',
            templateUrl: "assets/views/ui_notes.html",
            title: 'Notes',
            resolve: loadSequence('notesCtrl'),
            ncyBreadcrumb: {
                label: 'Notes'
            }
        }).state('app.ui.buttons', {
            url: '/buttons',
            templateUrl: "assets/views/ui_buttons.html",
            title: 'Buttons',
            resolve: loadSequence('spin', 'ladda', 'angular-ladda', 'laddaCtrl'),
            ncyBreadcrumb: {
                label: 'Buttons'
            }
        }).state('app.ui.links', {
            url: '/links',
            templateUrl: "assets/views/ui_links.html",
            title: 'Link Effects',
            ncyBreadcrumb: {
                label: 'Link Effects'
            }
        }).state('app.ui.icons', {
            url: '/icons',
            templateUrl: "assets/views/ui_icons.html",
            title: 'Font Awesome Icons',
            ncyBreadcrumb: {
                label: 'Font Awesome Icons'
            },
            resolve: loadSequence('iconsCtrl')
        }).state('app.ui.lineicons', {
            url: '/line-icons',
            templateUrl: "assets/views/ui_line_icons.html",
            title: 'Linear Icons',
            ncyBreadcrumb: {
                label: 'Linear Icons'
            },
            resolve: loadSequence('iconsCtrl')
        }).state('app.ui.modals', {
            url: '/modals',
            templateUrl: "assets/views/ui_modals.html",
            title: 'Modals',
            ncyBreadcrumb: {
                label: 'Modals'
            },
            resolve: loadSequence('asideCtrl')
        }).state('app.ui.toggle', {
            url: '/toggle',
            templateUrl: "assets/views/ui_toggle.html",
            title: 'Toggle',
            ncyBreadcrumb: {
                label: 'Toggle'
            }
        }).state('app.ui.tabs_accordions', {
            url: '/accordions',
            templateUrl: "assets/views/ui_tabs_accordions.html",
            title: "Tabs & Accordions",
            ncyBreadcrumb: {
                label: 'Tabs & Accordions'
            },
            resolve: loadSequence('vAccordionCtrl')
        }).state('app.ui.panels', {
            url: '/panels',
            templateUrl: "assets/views/ui_panels.html",
            title: 'Panels',
            ncyBreadcrumb: {
                label: 'Panels'
            }
        }).state('app.ui.notifications', {
            url: '/notifications',
            templateUrl: "assets/views/ui_notifications.html",
            title: 'Notifications',
            ncyBreadcrumb: {
                label: 'Notifications'
            },
            resolve: loadSequence('toasterCtrl', 'sweetAlertCtrl')
        }).state('app.ui.treeview', {
            url: '/treeview',
            templateUrl: "assets/views/ui_tree.html",
            title: 'TreeView',
            ncyBreadcrumb: {
                label: 'Treeview'
            },
            resolve: loadSequence('angularBootstrapNavTree', 'treeCtrl')
        }).state('app.ui.media', {
            url: '/media',
            templateUrl: "assets/views/ui_media.html",
            title: 'Media',
            ncyBreadcrumb: {
                label: 'Media'
            }
        }).state('app.ui.nestable', {
            url: '/nestable2',
            templateUrl: "assets/views/ui_nestable.html",
            title: 'Nestable List',
            ncyBreadcrumb: {
                label: 'Nestable List'
            },
            resolve: loadSequence('jquery-nestable-plugin', 'ng-nestable', 'nestableCtrl')
        }).state('app.ui.typography', {
            url: '/typography',
            templateUrl: "assets/views/ui_typography.html",
            title: 'Typography',
            ncyBreadcrumb: {
                label: 'Typography'
            }
        }).state('app.table', {
            url: '/table',
            template: '<div ui-view class="fade-in-up"></div>',
            title: 'Tables',
            ncyBreadcrumb: {
                label: 'Tables'
            }
        }).state('app.table.basic', {
            url: '/basic',
            templateUrl: "assets/views/table_basic.html",
            title: 'Basic Tables',
            ncyBreadcrumb: {
                label: 'Basic'
            }
        }).state('app.table.users', {
            url: '/users',
            templateUrl: "assets/views/table_users.html",
            title: 'Users Table',
            ncyBreadcrumb: {
                label: 'Users'
            },
            resolve: loadSequence('monospaced.elastic', 'ui.mask', 'ngTable', 'userTableCtrl'),
            data: {
                permissions: {
                    only: ['admin']
                }
            }
        }).state('app.table.openCases', {
            url: '/openCases',
            templateUrl: "assets/views/table_cases.html",
            title: 'Open cases Table',
            ncyBreadcrumb: {
                label: 'Cases'
            },
            resolve: loadSequence('moment', 'angularMoment', 'ui.select', 'ui.mask', 'ngTable', 'closeCaseModalCtrl', 'caseModalCtrl', 'casesTableCtrl'),
            data: {
                permissions: {
                    only: ['admin', 'supervisor']
                }
            }
        }).state('app.table.closeCases', {
            url: '/closeCases',
            templateUrl: "assets/views/table_closedCases.html",
            title: 'Closed cases Table',
            ncyBreadcrumb: {
                label: 'Cases'
            },
            resolve: loadSequence('monospaced.elastic', 'ui.select', 'ui.mask', 'ngTable', 'caseModalCtrl', 'closedCasesCtrl'),
            data: {
                permissions: {
                    only: ['admin', 'supervisor']
                }
            }
        }).state('app.table.pickCases', {
            url: '/pickCases',
            templateUrl: "assets/views/table_pickcases.html",
            title: 'Open cases Table',
            ncyBreadcrumb: {
                label: 'Cases'
            },
            resolve: loadSequence('moment', 'angularMoment', 'ui.select', 'ui.mask', 'ngTable', 'closeCaseModalCtrl', 'caseModalCtrl', 'pickCasesTableCtrl'),
            data: {
                permissions: {
                    only: ['admin', 'supervisor']
                }
            }
        }).state('app.table.technicianCases', {
            url: '/technicianCases',
            templateUrl: "assets/views/table_techniciancases.html",
            title: 'Techinician cases Table',
            ncyBreadcrumb: {
                label: 'Cases'
            },
            resolve: loadSequence('monospaced.elastic', 'ui.select', 'ui.mask', 'ngTable', 'caseModalCtrl', 'technicianCasesTableCtrl'),
            data: {
                permissions: {
                    only: ['technician']
                }
            }
        }).state('app.table.mysales', {
            url: '/sales/:uQuserId',
            templateUrl: "assets/views/mysales.html",
            title: 'My sales',
            ncyBreadcrumb: {
                label: 'Sales'
            },
            resolve: loadSequence('ui.select', 'monospaced.elastic', 'ui.mask', 'moment', 'angularMoment', 'mySalesCtrl'),
            data: {
                permissions: {
                    only: ['agent', 'supervisor', 'technician']
                }
            }
        }).state('app.table.findsales', {
            url: '/findsales',
            templateUrl: "assets/views/find_sales.html",
            title: 'Find Sales',
            ncyBreadcrumb: {
                label: 'Find Sales'
            },
            resolve: loadSequence('monospaced.elastic', 'ui.mask', 'ngTable', 'findSalesCtrl'),
            data: {
                permissions: {
                    only: ['agent', 'supervisor', 'admin', 'technician']
                }
            }
        }).state('app.table.allsales', {
            url: '/allsale',
            templateUrl: "assets/views/table_sales.html",
            title: 'Sales Table',
            ncyBreadcrumb: {
                label: 'Sales'
            },
            resolve: loadSequence('ui.select', 'monospaced.elastic', 'ui.mask', 'ngTable', 'salesTableCtrl'),
            data: {
                permissions: {
                    only: ['admin']
                }
            }
        }).state('app.table.allsalesagent', {
            url: '/allsaleagent',
            templateUrl: "assets/views/table_sales_agent.html",
            title: 'Sales Table',
            ncyBreadcrumb: {
                label: 'Sales'
            },
            resolve: loadSequence('ui.select', 'monospaced.elastic', 'ui.mask', 'ngTable', 'agentSalesTableCtrl'),
            data: {
                permissions: {
                    only: ['supervisor']
                }
            }
        }).state('app.table.booking', {
            url: '/bookings',
            templateUrl: "assets/views/table_booking.html",
            title: 'Booking Table',
            ncyBreadcrumb: {
                label: 'Booking'
            },
            resolve: loadSequence('monospaced.elastic', 'ui.mask', 'ngTable', 'bookingTableCtrl'),
            data: {
                permissions: {
                    only: ['admin']
                }
            }
        }).state('app.table.responsive', {
            url: '/responsive',
            templateUrl: "assets/views/table_responsive.html",
            title: 'Responsive Tables',
            ncyBreadcrumb: {
                label: 'Responsive'
            }
        }).state('app.table.data', {
            url: '/data',
            templateUrl: "assets/views/table_data.html",
            title: 'ngTable',
            ncyBreadcrumb: {
                label: 'ngTable'
            },
            resolve: loadSequence('ui.select', 'ngTable', 'ngTableCtrl')
        }).state('app.table.export', {
            url: '/export',
            templateUrl: "assets/views/table_export.html",
            title: 'Table'
        }).state('app.form', {
            url: '/form',
            template: '<div ui-view class="fade-in-up"></div>',
            title: 'Forms',
            ncyBreadcrumb: {
                label: 'Forms'
            }
        }).state('app.form.elements', {
            url: '/elements',
            templateUrl: "assets/views/form_elements.html",
            title: 'Forms Elements',
            ncyBreadcrumb: {
                label: 'Elements'
            },
            resolve: loadSequence('ui.select', 'monospaced.elastic', 'ui.mask', 'touchspin-plugin', 'selectCtrl')
        }).state('app.form.newuser', {
            url: '/user/new',
            templateUrl: "assets/views/form_newuser.html",
            title: 'Forms User',
            ncyBreadcrumb: {
                label: 'New User'
            },
            resolve: loadSequence('toaster', 'spin', 'angularSpinner', 'newUserCtrl'),
            data: {
                permissions: {
                    only: ['admin'],
                    redirectTo: 'login.signin'
                }
            }
        }).state('app.form.sale', {
            url: '/sale/new/:caseId',
            templateUrl: "assets/views/form_sale.html",
            title: 'New Sale',
            ncyBreadcrumb: {
                label: 'New Sale'
            },
            resolve: loadSequence('ui.select', 'toaster', 'spin', 'angularSpinner', 'saleCtrl'),
            data: {
                permissions: {
                    only: ['agent', 'supervisor', 'technician', 'admin'],
                    redirectTo: 'login.signin'
                }
            }
        }).state('app.pages.user', {
            url: '/user',
            templateUrl: "assets/views/pages_user_profile.html",
            title: 'User Profile',
            ncyBreadcrumb: {
                label: 'User Profile'
            },
            resolve: loadSequence('flow', 'userCtrl')
        }).state('app.pages.invoice', {
            url: '/invoice',
            templateUrl: "assets/views/pages_invoice.html",
            title: 'Invoice',
            ncyBreadcrumb: {
                label: 'Invoice'
            }
        }).state('app.pages.timeline', {
            url: '/timeline',
            templateUrl: "assets/views/pages_timeline.html",
            title: 'Timeline',
            ncyBreadcrumb: {
                label: 'Timeline'
            },
            resolve: loadSequence('ngMap')
        }).state('app.pages.calendar', {
            url: '/calendar',
            templateUrl: "assets/views/pages_calendar.html",
            title: 'Calendar',
            ncyBreadcrumb: {
                label: 'Calendar'
            },
            resolve: loadSequence('moment', 'mwl.calendar', 'calendarCtrl')
        }).state('app.pages.messages', {
            url: '/messages',
            templateUrl: "assets/views/pages_messages.html",
            resolve: loadSequence('truncate', 'htmlToPlaintext', 'inboxCtrl')
        }).state('app.pages.messages.inbox', {
            url: '/inbox/:inboxID',
            templateUrl: "assets/views/pages_inbox.html",
            controller: 'ViewMessageCrtl'
        }).state('app.pages.blank', {
            url: '/blank',
            templateUrl: "assets/views/pages_blank_page.html",
            ncyBreadcrumb: {
                label: 'Starter Page'
            }
        }).state('app.utilities', {
            url: '/utilities',
            template: '<div ui-view class="fade-in-up"></div>',
            title: 'Utilities',
            ncyBreadcrumb: {
                label: 'Utilities'
            }
        }).state('app.utilities.search', {
            url: '/search',
            templateUrl: "assets/views/utility_search_result.html",
            title: 'Search Results',
            ncyBreadcrumb: {
                label: 'Search Results'
            }
        }).state('app.utilities.pricing', {
            url: '/pricing',
            templateUrl: "assets/views/utility_pricing_table.html",
            title: 'Pricing Table',
            ncyBreadcrumb: {
                label: 'Pricing Table'
            }
        }).state('app.maps', {
            url: "/maps",
            templateUrl: "assets/views/maps.html",
            resolve: loadSequence('ngMap', 'mapsCtrl'),
            title: "Maps",
            ncyBreadcrumb: {
                label: 'Maps'
            }
        }).state('app.charts', {
            url: "/charts",
            templateUrl: "assets/views/charts.html",
            resolve: loadSequence('chartjs', 'tc.chartjs', 'chartsCtrl'),
            title: "Charts",
            ncyBreadcrumb: {
                label: 'Charts'
            }
        }).state('app.documentation', {
            url: "/documentation",
            templateUrl: "assets/views/documentation.html",
            title: "Documentation",
            ncyBreadcrumb: {
                label: 'Documentation'
            }
        }).state('error', {
            url: '/error',
            template: '<div ui-view class="fade-in-up"></div>'
        }).state('error.404', {
            url: '/404',
            templateUrl: "assets/views/utility_404.html",
        }).state('error.500', {
            url: '/500',
            templateUrl: "assets/views/utility_500.html",
        })

        // Login routes

        .state('login', {
            url: '/login',
            template: '<div ui-view class="fade-in-right-big smooth"></div>',
            resolve: loadSequence('toaster'),
            abstract: true
        }).state('login.signin', {
            url: '/signin',
            templateUrl: "assets/views/login_login.html",
            resolve: loadSequence('loginCtrl'),
        }).state('login.forgot', {
            url: '/forgot',
            templateUrl: "assets/views/login_forgot.html"
        }).state('login.registration', {
            url: '/registration',
            templateUrl: "assets/views/login_registration.html"
        }).state('login.lockscreen', {
            url: '/lock',
            templateUrl: "assets/views/login_lock_screen.html"
        });
        // For any unmatched url, redirect to /app/dashboard
        $urlRouterProvider.otherwise("/login/signin");

        // Generates a resolve object previously configured in constant.JS_REQUIRES (config.constant.js)
        function loadSequence() {
            var _args = arguments;
            return {
                deps: ['$ocLazyLoad', '$q',
                    function($ocLL, $q) {
                        var promise = $q.when(1);
                        for (var i = 0, len = _args.length; i < len; i++) {
                            promise = promiseThen(_args[i]);
                        }
                        return promise;

                        function promiseThen(_arg) {
                            if (typeof _arg == 'function')
                                return promise.then(_arg);
                            else
                                return promise.then(function() {
                                    var nowLoad = requiredData(_arg);
                                    if (!nowLoad)
                                        return $.error('Route resolve: Bad resource name [' + _arg + ']');
                                    return $ocLL.load(nowLoad);
                                });
                        }

                        function requiredData(name) {
                            if (jsRequires.modules)
                                for (var m in jsRequires.modules)
                                    if (jsRequires.modules[m].name && jsRequires.modules[m].name === name)
                                        return jsRequires.modules[m];
                            return jsRequires.scripts && jsRequires.scripts[name];
                        }
                    }
                ]
            };
        }
    }
]);