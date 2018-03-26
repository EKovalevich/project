$(document).ready(function () {


    gitPanel = {
        $this: this,
        options: {
            body: $('#body'),
            api: {
                url: 'api.php',
                method: 'post'
            },
        },

        init: function (parameters) {
            gitPanel.options = Object.assign(gitPanel.options, {});

            if (parameters) {
                gitPanel.options = Object.assign(gitPanel.options, parameters);
            }
        },

        renderPage: function (parameters) {
            html = '';

            if (parameters.title) {
                html += '<h1 class="title">' + parameters.title + '</h1>';
            }

            if (parameters.html) {
                html += '<div class="page">' + parameters.html + '</div>';
            }

            if (parameters.interface) {
                html += gitPanel.renderInterface(parameters.interface);
            }

            gitPanel.options.content.html(html)
            gitPanel.options = Object.assign(gitPanel.options, {interface: $('#interface')});
        },

        renderPopap: function () {

        },

        renderInterface: function (interface) {
            html = '<div id="interface" class="interface">';
            interface.forEach(function (value, index) {
                switch (value.type) {
                    case 'button':
                        html += '<button ';

                        if (value.data_type) {
                            html += 'data-type="' + value.data_type + '"';
                        }

                        if (value.method) {
                            html += 'data-method="' + value.method + '"';
                        }

                        if (value.id) {
                            html += 'id="' + value.id + '"';
                        }

                        html += '>';

                        if (value.name) {
                            html += value.name;
                        }

                        '</button>'
                        break;
                    case 'textarea':
                        html += '<textarea ';

                        if (value.data_type) {
                            html += 'data-type="' + value.data_type + '"';
                        }

                        if (value.id) {
                            html += 'id="' + value.id + '"';
                        }

                        html += '>';

                        if (value.name) {
                            html += value.name;
                        }

                        html += '</textarea>';
                        break;
                }
            })
            return html;
        },

        renderStatus: function () {
            data = gitPanel.getData({type: 'status'})
            if (data.result) {
                html = '<div id="result" class="result">';
                $(data.data).each(function (i, val) {
                    if (val.match(/\(use "/)) {
                        if (val.match(/git reset HEAD/)) {
                            flag = 'reset';
                        }
                        if (val.match(/git rm --cached/)) {
                            flag = 'rm';
                        } else if (val.match(/git add <file>..." to update/)) {
                            flag = 'add, checkout';
                        } else if (val.match(/git checkout/)) {
                            flag = 'add, checkout';
                        } else if (val.match(/git add <file>..." to include/)) {
                            flag = 'add';
                        }
                    }

                    regex = /([#\t+](([^\s].+):\s+(.+)))|([#\t+]([^\s+].+))/g;
                    var m;

                    if ((m = regex.exec(val)) !== null) {
                        if (m[5] == undefined) {
                            html += ('<label class="statusRow ' + m[3].replace(' ', '_') + '"><input type="checkbox" data-type="' + flag + '" value="' + m[4] + '">' + m[3] + ' : ' + m[4] + '</label>');
                        } else if (m[1] == undefined) {
                            html += ('<label class="statusRow not_type"><input type="checkbox" data-type="' + flag + '" value="' + m[6] + '">' + m[6] + '</label>');
                        }
                    } else {
                        html += ('<p>' + val + '</p>');
                    }
                });
                html += '</div>';
            } else {
                html = data.message;
            }
            return html;
        },

        callbackStatus: function () {
            gitPanel.options.interface.on('click', gitPanel.options.status.buttonsID, function () {
                var data = {};
                gitPanel.options.status.result.find('input[data-type="' + $(this).data('type') + '"]:checked').each(function (i, val) {
                    data[i] = $(val).val();
                });

                data = {
                    type: $(this).data('method'),
                    data: data
                };

                responce = gitPanel.getData(data)

                if (responce.result) {
                    gitPanel.updateStatus();
                } else {
                    alert('Error: reload page; ' + responce.message);
                }
            })
        },

        updateStatus: function () {
            html = gitPanel.renderStatus()
            gitPanel.options.status.result.replaceWith(html)
            gitPanel.options.status.result=$('#result');
        },

        renderCommit: function () {
            return html = '<div id="result"></div>';
        },

        callbackCommit: function () {

        },

        renderBranch: function () {
            data = gitPanel.getData({type: 'branch'})
            if (data.result) {
                html = '<div class="result">';
                $(data.data).each(function (i, val) {
                    html += '<p>' + val + '</p>'
                });
                html += '</div>'
            } else {
                html = data.message
            }
            return html;
        },

        callbackBranch: function () {

        },

        getData: function (data) {
            $.ajaxSetup({async: false});
            var remote;
            $.post(gitPanel.options.api.url, data, function (data) {
                remote = JSON.parse(data);
            });
            return remote;
        },

        renderApplication: function () {
            gitPanel.options = Object.assign(gitPanel.options, {
                menuStructure: [
                    {
                        name: 'status',
                        icon: 'img/status.png',
                        type: 'status',
                    },
                    {
                        name: 'commits',
                        icon: 'img/commit.png',
                        type: 'commit',
                    },
                    {
                        name: 'branch',
                        icon: 'img/branch.png',
                        type: 'branch',
                    },
                    {
                        name: 'diff',
                        icon: 'img/diff.png',
                        type: 'diff',
                    },
                    {
                        name: 'settings',
                        icon: 'img/settings.png',
                        type: 'settings',
                    },
                    {
                        name: 'exit',
                        icon: 'img/exit.png',
                        type: 'exit',
                    },

                ],
            });


            html = '<header class="col-xs-1"><div class="logo clearfix">G<span>P</span></div><nav id="menu" class="menu"><ul>';
            gitPanel.options.menuStructure.forEach(function (value) {
                html += '<li data-type="' + value.type + '" data-tooltip="' + value.name + '"><img src="' + value.icon + '" alt=""></li>';
            })
            html += '</ul></nav></header><div class="body col-xs-11"><div class="wraper" id="content"></div></div>';

            gitPanel.options.body.html(html)

            gitPanel.init();
            gitPanel.options = Object.assign(gitPanel.options, {
                menu: $('#menu'),
                menuChild: 'li',
                content: $('#content'),

            });
            this.callbackApplication();
        },

        callbackApplication: function () {
            if (gitPanel.options.menu) {
                gitPanel.options.menu.on('click', gitPanel.options.menuChild, function () {
                    switch ($(this).data('type')) {
                        case 'status':
                            html = gitPanel.renderStatus();
                            parameters = {
                                title: 'Status',
                                html: html,
                                interface: [
                                    {
                                        type: 'button',
                                        data_type: 'reset',
                                        method: 'statusGitResetHead',
                                        name: 'git reset HEAD',
                                        id: 'statusBtn'
                                    },
                                    {
                                        type: 'button',
                                        data_type: 'add',
                                        method: 'statusGitAdd',
                                        name: 'git add',
                                        id: 'statusBtn'
                                    },
                                    {
                                        type: 'button',
                                        data_type: 'rm',
                                        method: 'statusGitRm',
                                        name: 'git rm',
                                        id: 'statusBtn'
                                    },
                                    {
                                        type: 'button',
                                        data_type: 'rm',
                                        method: 'statusGitRmCached',
                                        name: 'git rm --cached',
                                        id: 'statusBtn'
                                    },
                                    {
                                        type: 'button',
                                        data_type: 'checkout',
                                        method: 'statusGitCheckout',
                                        name: 'git --checkout',
                                        id: 'statusBtn'
                                    },
                                ]
                            };
                            gitPanel.renderPage(parameters);
                            gitPanel.options = Object.assign(gitPanel.options, {
                                status: {
                                    result: $('#result'),
                                    buttons: $('#statusBtn'),
                                    buttonsID: '#statusBtn'
                                }
                            });
                            gitPanel.callbackStatus(parameters.interface);
                            break;
                        case 'branch':
                            html = gitPanel.renderBranch();
                            parameters = {
                                title: 'Branch',
                                html: html,
                            };
                            gitPanel.renderPage(parameters);
                            break;
                        case 'commit':
                            html = gitPanel.renderCommit();
                            parameters = {
                                title: 'Commit',
                                html: html,
                                interface: [
                                    {
                                        type: 'textarea',
                                        id: 'commit'
                                    },
                                    {
                                        type: 'button',
                                        name: 'git commit -m',
                                        method: 'commitMessage',
                                        id: 'commitBtn'
                                    },
                                ]
                            };
                            gitPanel.renderPage(parameters);
                            break;
                        case 'diff':
                            break;
                        case 'log':
                            break;
                        case 'settings':
                            break;
                        case 'exit':
                            data = {type: 'logout'};
                            responce = gitPanel.getData(data)
                            if (responce.result) {
                                gitPanel.renderLogin();
                            }
                            break;
                    }
                })
            }
        },

        renderLogin: function () {
            html = '<div class="popap-background">' +
                '</div>' +
                '<div class="popap popap-login">' +
                '<div class="popap-content">' +
                '<p class="title">Hello</p>' +
                '<p class="popap-desriptions">This is a git panel, you need to log in to work with it.</p>' +
                '<form id="authorization">' +
                '<div class="input-group">' +
                '<input id="login" type="text" class="form-control" placeholder="Username" aria-describedby="basic-addon1">' +
                '</div>' +
                '<div class="input-group">' +
                '<input id="password" type="password" class="form-control" placeholder="Password" aria-describedby="basic-addon1">' +
                '</div>' +
                '<button type="button" class="btn btn-primary">Sign in</button>' +
                '</form>' +
                '</div>';
            '</div>';

            gitPanel.options.body.html(html)
            gitPanel.options = Object.assign(gitPanel.options, {
                loginForm: $('#authorization'),
            });

            gitPanel.init();
            gitPanel.callbackLogin();
        },

        callbackLogin: function () {
            gitPanel.options.loginForm.on('click', 'button', function (e) {
                e.preventDefault();
                login = gitPanel.options.loginForm.find('#login').val();
                password = gitPanel.options.loginForm.find('#password').val();

                data = {
                    type: 'authorization',
                    data: {
                        login: login,
                        password: password
                    }
                }
                console.log(data);
                responce = gitPanel.getData(data);
                console.log(responce);
                if (responce.result) {
                    gitPanel.renderApplication()
                } else {
                    if (gitPanel.options.configuration.form.find("label.error").length) {
                        gitPanel.options.configuration.form.find("label.error").html(responce.message);
                    } else {
                        gitPanel.options.configuration.form.append('<label class="error">' + responce.message + '</label>');
                    }
                }
            })
        },

        renderStartSetings: function () {
            html = '<div class="popap-background">' +
                '</div>' +
                '<div class="popap popap-login">' +
                '<div class="popap-content">' +
                '<p class="title">Hello</p>' +
                '<p class="popap-desriptions">Before you continue, you must create a config file.</p>' +
                '<form id="configuration">' +
                '<div class="input-group">' +
                '<input type="checkbox" class="form-check-input" id="notUser" name="notUser">' +
                '<label class="form-check-label" for="notUser">Not create user</label>' +
                '</div>' +
                '<div class="input-group">' +
                '<input id="login" type="text" class="form-control" placeholder="Username" aria-describedby="basic-addon1">' +
                '</div>' +
                '<div class="input-group">' +
                '<input id="password" type="password" class="form-control" placeholder="Password" aria-describedby="basic-addon1">' +
                '</div>' +
                '<div class="input-group">' +
                '<input id="gitRepo" type="text" class="form-control" placeholder="git repository href" aria-describedby="basic-addon1">' +
                '</div>' +
                '<div class="input-group">' +
                '<input id="gitPassword" type="password" class="form-control" placeholder="git repository password" aria-describedby="basic-addon1">' +
                '</div>' +
                '<button type="button" class="btn btn-primary">Create config</button>' +
                '</form>' +
                '</div>';
            '</div>';

            gitPanel.options.body.html(html)
            gitPanel.options = Object.assign(gitPanel.options, {
                configuration: {
                    form: $('#configuration'),
                    notUser: $('#notUser'),
                    login: $('#login'),
                    password: $('#password'),
                    repoHref: $('#gitRepo'),
                    repoPassword: $('#gitPassword'),
                }
            });
            gitPanel.init();
            gitPanel.callbackStartSettings();

        },

        callbackStartSettings: function () {
            gitPanel.options.configuration.form.on('click', 'button', function () {
                if ((gitPanel.options.configuration.notUser.prop('checked') || (!gitPanel.options.configuration.notUser.prop('checked') &&
                    gitPanel.options.configuration.login.val() && gitPanel.options.configuration.password.val())) && gitPanel.options.configuration.repoHref.val() && gitPanel.options.configuration.repoPassword.val()) {

                    if (gitPanel.options.configuration.notUser.prop('checked')) {
                        data = {
                            type: 'startConfig',
                            data: {
                                notUser: true,
                                repoHref: gitPanel.options.configuration.repoHref.val(),
                                repoPassword: gitPanel.options.configuration.repoPassword.val()
                            }
                        }
                    } else {
                        data = {
                            type: 'startConfig',
                            data: {
                                notUser: false,
                                login: gitPanel.options.configuration.login.val(),
                                password: gitPanel.options.configuration.password.val(),
                                repoHref: gitPanel.options.configuration.repoHref.val(),
                                repoPassword: gitPanel.options.configuration.repoPassword.val()
                            }
                        }
                    }

                    responce = gitPanel.getData(data)
                    if (responce.result) {
                        if (data.notUser) {
                            gitPanel.renderApplication()
                        } else {
                            gitPanel.renderLogin()
                        }
                    } else {
                        if (gitPanel.options.configuration.form.find("label.error").length) {
                            gitPanel.options.configuration.form.find("label.error").html(responce.message);
                        } else {
                            gitPanel.options.configuration.form.append('<label class="error">' + responce.message + '</label>');
                        }
                    }

                } else {
                    if (gitPanel.options.configuration.form.find("label.error").length) {
                        gitPanel.options.configuration.form.find("label.error").html('Error: You have not filled in the data');
                    } else {
                        gitPanel.options.configuration.form.append('<label class="error">Error: You have not filled in the data</label>');
                    }

                }

            });

            gitPanel.options.configuration.notUser.on('change', function () {
                if ($(this).prop('checked')) {
                    gitPanel.options.configuration.login.attr('disabled', 'disabled');
                    gitPanel.options.configuration.password.attr('disabled', 'disabled');
                } else {
                    gitPanel.options.configuration.login.removeAttr('disabled', 'disabled');
                    gitPanel.options.configuration.password.removeAttr('disabled', 'disabled');
                }
            });
        }

    }

});
