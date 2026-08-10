/* =====================================================
   GITSTATUS
   GitHub Public Profile Explorer
===================================================== */


/* =====================================================
   CONFIGURATION
===================================================== */

const API_BASE = "https://api.github.com";

/*
    GitHub REST API version.

    This can be updated in the future if GitHub
    changes its recommended API version.
*/
const API_VERSION = "2026-03-10";


/* =====================================================
   DOM HELPERS
===================================================== */

const $ = (selector) =>
    document.querySelector(selector);


/* =====================================================
   DOM REFERENCES
===================================================== */

const els = {

    html: document.documentElement,

    form: $("#searchForm"),

    input: $("#usernameInput"),

    clear: $("#clearSearch"),

    theme: $("#themeToggle"),

    apiStatus: $("#apiStatus"),

    dashboard: $("#dashboard"),

    loading: $("#loadingState"),

    loadingText: $("#loadingText"),

    error: $("#errorCard"),

    errorTitle: $("#errorTitle"),

    errorMessage: $("#errorMessage"),

    retry: $("#retryBtn"),


    /* Profile */

    avatar: $("#avatar"),

    profileName: $("#profileName"),

    profileUsername: $("#profileUsername"),

    profileBio: $("#profileBio"),

    profileLink: $("#profileLink"),

    profileButton: $("#profileButton"),

    profileJoined: $("#profileJoined"),

    profileLocation: $("#profileLocation"),

    profileBlog: $("#profileBlog"),

    profileCompany: $("#profileCompany"),


    /* Statistics */

    statRepos: $("#statRepos"),

    statStars: $("#statStars"),

    statFollowers: $("#statFollowers"),

    statFollowing: $("#statFollowing"),

    topLanguage: $("#topLanguage"),

    eventCount: $("#eventCount"),

    statForks: $("#statForks"),

    archivedRepos: $("#archivedRepos"),

    languageBars: $("#languageBars"),

    languageTotal: $("#languageTotal"),


    /* Activity */

    activityList: $("#activityList"),


    /* Repositories */

    repoGrid: $("#repoGrid"),

    repoSort: $("#repoSort"),

    repoCountLabel: $("#repoCountLabel"),

    loadMore: $("#loadMore"),


    /* Footer */

    lastUpdated: $("#lastUpdated")
};


/* =====================================================
   APPLICATION STATE
===================================================== */

const state = {

    username: "",

    user: null,

    repos: [],

    events: [],

    visibleRepos: 9

};


/* =====================================================
   NUMBER FORMATTER
===================================================== */

function formatNumber(value) {

    return new Intl.NumberFormat(
        "en-US",
        {
            notation: "compact",
            maximumFractionDigits: 1
        }
    ).format(value || 0);

}


/* =====================================================
   DATE FORMATTER
===================================================== */

function formatDate(dateString) {

    if (!dateString) {
        return "—";
    }

    return new Intl.DateTimeFormat(
        "en-US",
        {
            month: "short",
            year: "numeric"
        }
    ).format(
        new Date(dateString)
    );

}


/* =====================================================
   RELATIVE TIME
===================================================== */

function relativeTime(dateString) {

    const diff =
        Date.now()
        -
        new Date(dateString).getTime();

    const minutes =
        Math.floor(diff / 60000);

    if (minutes < 1) {
        return "just now";
    }

    if (minutes < 60) {
        return `${minutes}m ago`;
    }

    const hours =
        Math.floor(minutes / 60);

    if (hours < 24) {
        return `${hours}h ago`;
    }

    const days =
        Math.floor(hours / 24);

    if (days < 30) {
        return `${days}d ago`;
    }

    const months =
        Math.floor(days / 30);

    if (months < 12) {
        return `${months}mo ago`;
    }

    return `${Math.floor(months / 12)}y ago`;

}


/* =====================================================
   HTML ESCAPE
===================================================== */

function escapeHTML(value = "") {

    return String(value).replace(
        /[&<>"']/g,
        (char) => ({

            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"

        }[char])
    );

}


/* =====================================================
   API STATUS
===================================================== */

function setApiStatus(
    text,
    healthy = true
) {

    els.apiStatus.innerHTML = `

        <span
            class="status-dot"
            style="
                ${
                    healthy
                    ? ""
                    :
                    `
                        background:var(--danger);
                        box-shadow:
                        0 0 0 4px
                        rgba(251,113,133,.09);
                    `
                }
            "
        ></span>

        <span>
            ${escapeHTML(text)}
        </span>

    `;

}


/* =====================================================
   GITHUB FETCH
===================================================== */

async function githubFetch(
    path,
    options = {}
) {

    const response =
        await fetch(
            `${API_BASE}${path}`,
            {

                ...options,

                headers: {

                    "Accept":
                        "application/vnd.github+json",

                    "X-GitHub-Api-Version":
                        API_VERSION,

                    ...(options.headers || {})

                }

            }
        );


    /* Rate limit */

    const remaining =
        response.headers.get(
            "X-RateLimit-Remaining"
        );


    if (!response.ok) {

        if (
            response.status === 403 &&
            remaining === "0"
        ) {

            throw new Error(
                "GitHub API rate limit reached. " +
                "Please wait a while and try again."
            );

        }


        if (response.status === 404) {

            throw new Error(
                "That GitHub username does not exist, " +
                "or the public profile is unavailable."
            );

        }


        if (response.status === 422) {

            throw new Error(
                "GitHub rejected the username. " +
                "Please enter a valid public username."
            );

        }


        throw new Error(
            `GitHub returned an error (${response.status}).`
        );

    }


    return response.json();

}


/* =====================================================
   FETCH COMPLETE PROFILE
===================================================== */

async function fetchProfile(username) {

    const encoded =
        encodeURIComponent(username);


    const [
        user,
        repos,
        events
    ] = await Promise.all([

        githubFetch(
            `/users/${encoded}`
        ),

        githubFetch(
            `/users/${encoded}/repos` +
            `?per_page=100` +
            `&sort=updated` +
            `&direction=desc`
        ),

        githubFetch(
            `/users/${encoded}/events/public` +
            `?per_page=30`
        )

    ]);


    return {

        user,

        repos,

        events

    };

}


/* =====================================================
   RESET DASHBOARD
===================================================== */

function resetDashboard() {

    els.dashboard.hidden = true;

    els.error.hidden = true;

    els.loading.hidden = false;

    els.loadingText.textContent =
        "Fetching public GitHub data…";

}


/* =====================================================
   ERROR UI
===================================================== */

function showError(error) {

    els.loading.hidden = true;

    els.dashboard.hidden = true;

    els.error.hidden = false;

    els.errorTitle.textContent =
        "Profile unavailable";

    els.errorMessage.textContent =
        error.message ||
        "Unable to load this profile.";

    setApiStatus(
        "API error",
        false
    );

}


/* =====================================================
   DASHBOARD UI
===================================================== */

function showDashboard() {

    els.loading.hidden = true;

    els.error.hidden = true;

    els.dashboard.hidden = false;

    setApiStatus(
        "API connected",
        true
    );

}


/* =====================================================
   PROFILE RENDERER
===================================================== */

function renderProfile(user) {

    /* Avatar */

    els.avatar.src =
        user.avatar_url;

    els.avatar.alt =
        `${user.login} avatar`;


    /* Identity */

    els.profileName.textContent =
        user.name ||
        user.login;

    els.profileUsername.textContent =
        `@${user.login}`;


    /* Bio */

    els.profileBio.textContent =
        user.bio ||
        "No public bio provided.";


    /* GitHub URLs */

    els.profileLink.href =
        user.html_url;

    els.profileButton.href =
        user.html_url;


    /* Join date */

    els.profileJoined.textContent =
        formatDate(
            user.created_at
        );


    /* Optional metadata */

    setOptionalMeta(
        els.profileLocation,
        user.location
    );

    setOptionalMeta(
        els.profileCompany,
        user.company
    );


    /* Website */

    if (user.blog) {

        els.profileBlog.hidden = false;

        els.profileBlog.href =
            user.blog.startsWith("http")
            ?
            user.blog
            :
            `https://${user.blog}`;

        els.profileBlog.querySelector(
            "span"
        ).textContent =
            user.blog
                .replace(/^https?:\/\//, "")
                .replace(/\/$/, "");

    }

    else {

        els.profileBlog.hidden = true;

    }


    /* Main statistics */

    els.statRepos.textContent =
        formatNumber(
            user.public_repos
        );

    els.statFollowers.textContent =
        formatNumber(
            user.followers
        );

    els.statFollowing.textContent =
        formatNumber(
            user.following
        );

}


/* =====================================================
   OPTIONAL PROFILE FIELD
===================================================== */

function setOptionalMeta(
    element,
    value
) {

    if (value) {

        element.hidden = false;

        element.querySelector(
            "span"
        ).textContent =
            value;

    }

    else {

        element.hidden = true;

    }

}


/* =====================================================
   CALCULATE STATISTICS
===================================================== */

function calculateStats(repos) {

    const totalStars =
        repos.reduce(
            (sum, repo) =>
                sum +
                (repo.stargazers_count || 0),
            0
        );


    const totalForks =
        repos.reduce(
            (sum, repo) =>
                sum +
                (repo.forks_count || 0),
            0
        );


    const archived =
        repos.filter(
            repo => repo.archived
        ).length;


    /* Language counter */

    const languageCounts = {};


    repos.forEach(
        repo => {

            if (!repo.language) {
                return;
            }

            languageCounts[
                repo.language
            ] =
                (
                    languageCounts[
                        repo.language
                    ] || 0
                ) + 1;

        }
    );


    const languages =
        Object.entries(
            languageCounts
        ).sort(
            (a, b) =>
                b[1] - a[1]
        );


    const topLanguage =
        languages[0]?.[0] ||
        "Not detected";


    return {

        totalStars,

        totalForks,

        archived,

        topLanguage,

        languageCounts: languages

    };

}


/* =====================================================
   RENDER STATISTICS
===================================================== */

function renderStats(
    repos,
    events
) {

    const stats =
        calculateStats(repos);


    els.statStars.textContent =
        formatNumber(
            stats.totalStars
        );


    els.statForks.textContent =
        formatNumber(
            stats.totalForks
        );


    els.archivedRepos.textContent =
        formatNumber(
            stats.archived
        );


    els.topLanguage.textContent =
        stats.topLanguage;


    els.eventCount.textContent =
        formatNumber(
            events.length
        );


    /* Language total */

    const total =
        stats.languageCounts.reduce(
            (sum, [, count]) =>
                sum + count,
            0
        );


    els.languageTotal.textContent =
        total
        ?
        `${total} repos`
        :
        "No data";


    els.languageBars.innerHTML = "";


    const colors = [

        "#8b5cf6",
        "#60a5fa",
        "#35d399",
        "#f5c451",
        "#fb7185"

    ];


    stats.languageCounts
        .slice(0, 5)
        .forEach(
            ([language, count], index) => {

                const percentage =
                    total
                    ?
                    (count / total) * 100
                    :
                    0;


                const row =
                    document.createElement(
                        "div"
                    );


                row.className =
                    "language-row";


                row.innerHTML = `

                    <span
                        title="${escapeHTML(language)}"
                    >
                        ${escapeHTML(language)}
                    </span>


                    <div class="bar">

                        <i
                            style="
                                background:
                                ${colors[
                                    index %
                                    colors.length
                                ]};

                                width:
                                ${percentage}%;
                            "
                        ></i>

                    </div>


                    <span>
                        ${percentage.toFixed(0)}%
                    </span>

                `;


                els.languageBars.appendChild(
                    row
                );

            }
        );


    if (
        !stats.languageCounts.length
    ) {

        els.languageBars.innerHTML = `

            <span
                style="
                    color:var(--muted-2);
                    font-size:10px;
                "
            >
                No language data available.
            </span>

        `;

    }

}


/* =====================================================
   ACTIVITY DEFINITIONS
===================================================== */

const eventMeta = {

    PushEvent: [
        "fa-solid fa-code-commit",
        "Pushed code"
    ],

    PullRequestEvent: [
        "fa-solid fa-code-pull-request",
        "Pull request activity"
    ],

    IssuesEvent: [
        "fa-solid fa-circle-exclamation",
        "Issue activity"
    ],

    IssueCommentEvent: [
        "fa-regular fa-comment",
        "Commented on an issue"
    ],

    CreateEvent: [
        "fa-solid fa-plus",
        "Created something"
    ],

    DeleteEvent: [
        "fa-solid fa-trash",
        "Deleted something"
    ],

    ForkEvent: [
        "fa-solid fa-code-fork",
        "Forked a repository"
    ],

    WatchEvent: [
        "fa-solid fa-star",
        "Starred a repository"
    ],

    ReleaseEvent: [
        "fa-solid fa-tag",
        "Published a release"
    ],

    PublicEvent: [
        "fa-solid fa-globe",
        "Made a repository public"
    ],

    GollumEvent: [
        "fa-solid fa-book",
        "Updated a wiki"
    ],

    MemberEvent: [
        "fa-solid fa-user-group",
        "Repository membership activity"
    ],

    CommitCommentEvent: [
        "fa-regular fa-message",
        "Commented on a commit"
    ]

};


/* =====================================================
   EVENT DESCRIPTION
===================================================== */

function describeEvent(event) {

    const meta =
        eventMeta[event.type] ||
        [
            "fa-solid fa-bolt",
            event.type.replace(
                /Event$/,
                " activity"
            )
        ];


    const repo =
        event.repo?.name ||
        "a repository";


    let detail = repo;


    if (
        event.type ===
        "PushEvent"
    ) {

        const commits =
            event.payload?.size ||
            1;

        detail =
            `${repo} · ` +
            `${commits} commit` +
            `${commits === 1 ? "" : "s"}`;

    }


    else if (
        event.type ===
        "PullRequestEvent"
    ) {

        detail =
            `${repo} · ` +
            `${event.payload?.action || "updated"}`;

    }


    else if (
        event.type ===
        "IssuesEvent"
    ) {

        detail =
            `${repo} · ` +
            `${event.payload?.action || "updated"}`;

    }


    else if (
        event.type ===
        "ForkEvent"
    ) {

        detail =
            `${repo} · forked`;

    }


    else if (
        event.type ===
        "WatchEvent"
    ) {

        detail =
            `${repo} · starred`;

    }


    return {

        icon: meta[0],

        title: meta[1],

        detail

    };

}


/* =====================================================
   ACTIVITY RENDERER
===================================================== */

function renderActivity(events) {

    els.activityList.innerHTML = "";


    if (!events.length) {

        els.activityList.innerHTML = `

            <div
                style="
                    padding:20px 0;
                    color:var(--muted-2);
                    font-size:11px;
                "
            >
                No recent public activity was
                returned by GitHub.
            </div>

        `;

        return;

    }


    events
        .slice(0, 12)
        .forEach(
            event => {

                const data =
                    describeEvent(
                        event
                    );


                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "activity-item";


                item.innerHTML = `

                    <div class="activity-icon">

                        <i
                            class="${data.icon}"
                        ></i>

                    </div>


                    <div class="activity-text">

                        <strong>
                            ${escapeHTML(
                                data.title
                            )}
                        </strong>


                        <p>
                            ${escapeHTML(
                                data.detail
                            )}
                        </p>


                        <div
                            class="activity-time"
                        >
                            ${relativeTime(
                                event.created_at
                            )}
                        </div>

                    </div>

                `;


                els.activityList.appendChild(
                    item
                );

            }
        );

}


/* =====================================================
   SORT REPOSITORIES
===================================================== */

function sortedRepos() {

    const repos =
        [...state.repos];


    switch (
        els.repoSort.value
    ) {

        case "updated":

            return repos.sort(
                (a, b) =>
                    new Date(
                        b.updated_at
                    )
                    -
                    new Date(
                        a.updated_at
                    )
            );


        case "forks":

            return repos.sort(
                (a, b) =>
                    b.forks_count
                    -
                    a.forks_count
            );


        case "name":

            return repos.sort(
                (a, b) =>
                    a.name.localeCompare(
                        b.name
                    )
            );


        case "stars":

        default:

            return repos.sort(
                (a, b) =>
                    b.stargazers_count
                    -
                    a.stargazers_count
            );

    }

}


/* =====================================================
   REPOSITORY RENDERER
===================================================== */

function renderRepos() {

    const repos =
        sortedRepos();


    const visible =
        repos.slice(
            0,
            state.visibleRepos
        );


    els.repoGrid.innerHTML = "";


    els.repoCountLabel.textContent =

        `${state.repos.length} public repo` +

        (
            state.repos.length === 1
            ? ""
            : "s"
        );


    visible.forEach(
        repo => {

            const template =
                $("#repoTemplate");


            const card =
                template.content.cloneNode(
                    true
                );


            const name =
                card.querySelector(
                    ".repo-name"
                );


            const description =
                card.querySelector(
                    ".repo-description"
                );


            const topics =
                card.querySelector(
                    ".topic-list"
                );


            const language =
                card.querySelector(
                    ".repo-language span"
                );


            const stars =
                card.querySelector(
                    ".repo-stars"
                );


            const forks =
                card.querySelector(
                    ".repo-forks"
                );


            const updated =
                card.querySelector(
                    ".repo-updated"
                );


            /* Name */

            name.textContent =
                repo.name;

            name.href =
                repo.html_url;


            /* Description */

            description.textContent =
                repo.description ||
                "No description provided.";


            /* Metadata */

            language.textContent =
                repo.language ||
                "Other";


            stars.textContent =
                formatNumber(
                    repo.stargazers_count
                );


            forks.textContent =
                formatNumber(
                    repo.forks_count
                );


            updated.textContent =
                relativeTime(
                    repo.updated_at
                );


            /* Topics */

            (
                repo.topics || []
            )
                .slice(0, 3)
                .forEach(
                    topic => {

                        const tag =
                            document.createElement(
                                "span"
                            );

                        tag.className =
                            "topic";

                        tag.textContent =
                            topic;

                        topics.appendChild(
                            tag
                        );

                    }
                );


            /* Archived tag */

            if (repo.archived) {

                const tag =
                    document.createElement(
                        "span"
                    );

                tag.className =
                    "topic";

                tag.textContent =
                    "archived";

                topics.appendChild(
                    tag
                );

            }


            els.repoGrid.appendChild(
                card
            );

        }
    );


    /*
        Show load-more button only when
        more repositories remain.
    */

    els.loadMore.hidden =
        visible.length >=
        repos.length;

}


/* =====================================================
   MAIN ANALYZE FUNCTION
===================================================== */

async function analyze(
    username
) {

    /*
        Clean input.

        This allows users to enter:

        username
        @username

        without breaking the API request.
    */

    username =
        username
            .trim()
            .replace(/^@/, "");


    if (!username) {
        return;
    }


    state.username =
        username;


    els.input.value =
        username;


    els.clear.hidden =
        false;


    const searchButton =
        els.form.querySelector(
            ".search-btn"
        );


    searchButton.disabled =
        true;


    resetDashboard();


    try {

        els.loadingText.textContent =
            "Fetching profile, repositories, and activity…";


        const data =
            await fetchProfile(
                username
            );


        state.user =
            data.user;


        /*
            Private repositories are not returned
            for unauthenticated public requests,
            but this filter provides an additional
            defensive check.
        */

        state.repos =
            data.repos.filter(
                repo => !repo.private
            );


        state.events =
            data.events;


        state.visibleRepos =
            9;


        /* Render all sections */

        renderProfile(
            state.user
        );


        renderStats(
            state.repos,
            state.events
        );


        renderActivity(
            state.events
        );


        renderRepos();


        /* Timestamp */

        els.lastUpdated.textContent =
            `Updated ${
                new Intl.DateTimeFormat(
                    "en-US",
                    {
                        hour: "numeric",
                        minute: "2-digit"
                    }
                ).format(
                    new Date()
                )
            }`;


        showDashboard();


        /*
            Smoothly move the user toward
            the loaded dashboard.
        */

        window.scrollTo({

            top:
                els.dashboard.offsetTop -
                20,

            behavior: "smooth"

        });

    }


    catch (error) {

        showError(
            error
        );

    }


    finally {

        searchButton.disabled =
            false;

    }

}


/* =====================================================
   THEME
===================================================== */

function loadTheme() {

    const saved =
        localStorage.getItem(
            "gitstatus-theme"
        );


    const theme =
        saved === "light"
        ?
        "light"
        :
        "dark";


    els.html.dataset.theme =
        theme;


    updateThemeIcon();

}


/* =====================================================
   THEME ICON
===================================================== */

function updateThemeIcon() {

    const isLight =
        els.html.dataset.theme ===
        "light";


    els.theme.innerHTML = `

        <i
            class="fa-solid ${
                isLight
                ? "fa-sun"
                : "fa-moon"
            }"
        ></i>

    `;


    els.theme.setAttribute(

        "aria-label",

        isLight
        ?
        "Switch to dark theme"
        :
        "Switch to light theme"

    );

}


/* =====================================================
   SEARCH FORM
===================================================== */

els.form.addEventListener(
    "submit",
    event => {

        event.preventDefault();

        analyze(
            els.input.value
        );

    }
);


/* =====================================================
   INPUT CHANGE
===================================================== */

els.input.addEventListener(
    "input",
    () => {

        els.clear.hidden =
            !els.input.value;

    }
);


/* =====================================================
   CLEAR SEARCH
===================================================== */

els.clear.addEventListener(
    "click",
    () => {

        els.input.value =
            "";

        els.input.focus();

        els.clear.hidden =
            true;

    }
);


/* =====================================================
   QUICK SEARCH
===================================================== */

document
    .querySelectorAll(
        "[data-example]"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    analyze(
                        button.dataset.example
                    );

                }
            );

        }
    );


/* =====================================================
   RETRY
===================================================== */

els.retry.addEventListener(
    "click",
    () => {

        analyze(
            state.username
        );

    }
);


/* =====================================================
   REPOSITORY SORT
===================================================== */

els.repoSort.addEventListener(
    "change",
    () => {

        state.visibleRepos =
            9;

        renderRepos();

    }
);


/* =====================================================
   LOAD MORE
===================================================== */

els.loadMore.addEventListener(
    "click",
    () => {

        state.visibleRepos +=
            9;

        renderRepos();

    }
);


/* =====================================================
   THEME TOGGLE
===================================================== */

els.theme.addEventListener(
    "click",
    () => {

        els.html.dataset.theme =
            els.html.dataset.theme ===
            "light"
            ?
            "dark"
            :
            "light";


        localStorage.setItem(
            "gitstatus-theme",
            els.html.dataset.theme
        );


        updateThemeIcon();

    }
);


/* =====================================================
   INITIALIZATION
===================================================== */

loadTheme();