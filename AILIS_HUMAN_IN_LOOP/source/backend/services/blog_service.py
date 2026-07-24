import json
from dataclasses import dataclass
from functools import lru_cache
from pathlib import Path
from typing import Any

import markdown


BLOG_DIR = Path(__file__).resolve().parent.parent / "blog_content"
POSTS_PATH = BLOG_DIR / "posts.json"
SITE_PATH = BLOG_DIR / "site.json"
POSTS_DIR = BLOG_DIR / "posts"

SUPPORTED_LOCALES = {"zh", "en"}


@dataclass(frozen=True)
class FeaturedProject:
    name: str
    description: str
    link: str


@dataclass(frozen=True)
class AboutSection:
    title: str
    body: str


@dataclass(frozen=True)
class InspirationLink:
    name: str
    url: str
    note: str


@dataclass(frozen=True)
class BlogSite:
    locale: str
    site_title: str
    site_subtitle: str
    hero_title: str
    hero_intro: str
    bio: str
    location: str
    email: str
    github: str
    x: str
    now_title: str
    now_text: str
    nav: dict[str, str]
    labels: dict[str, str]
    about_sections: list[AboutSection]
    featured_projects: list[FeaturedProject]
    inspirations: list[InspirationLink]
    projects_intro: str
    writing_intro: str


@dataclass(frozen=True)
class BlogPost:
    locale: str
    slug: str
    title: str
    summary: str
    published_at: str
    reading_time: str
    featured: bool
    tags: list[str]
    body_html: str


def _resolve_locale(locale: str | None) -> str:
    normalized = (locale or "zh").strip().lower()
    return normalized if normalized in SUPPORTED_LOCALES else "zh"


def _load_site(locale: str) -> BlogSite:
    with SITE_PATH.open("r", encoding="utf-8") as file:
        raw_site = json.load(file)

    locale_key = _resolve_locale(locale)
    localized = raw_site["locales"][locale_key]

    return BlogSite(
        locale=locale_key,
        site_title=str(localized["site_title"]),
        site_subtitle=str(localized["site_subtitle"]),
        hero_title=str(localized["hero_title"]),
        hero_intro=str(localized["hero_intro"]),
        bio=str(localized["bio"]),
        location=str(localized["location"]),
        email=str(localized["email"]),
        github=str(localized["github"]),
        x=str(localized.get("x", "")),
        now_title=str(localized["now_title"]),
        now_text=str(localized["now_text"]),
        nav=dict(localized["nav"]),
        labels=dict(localized["labels"]),
        about_sections=[
            AboutSection(title=str(item["title"]), body=str(item["body"]))
            for item in localized.get("about_sections", [])
        ],
        featured_projects=[
            FeaturedProject(
                name=str(item["name"]),
                description=str(item["description"]),
                link=str(item["link"]),
            )
            for item in localized.get("featured_projects", [])
        ],
        inspirations=[
            InspirationLink(
                name=str(item["name"]),
                url=str(item["url"]),
                note=str(item["note"]),
            )
            for item in localized.get("inspirations", [])
        ],
        projects_intro=str(localized["projects_intro"]),
        writing_intro=str(localized["writing_intro"]),
    )


def _render_markdown(body_file: str) -> str:
    body_path = BLOG_DIR / body_file
    raw_text = body_path.read_text(encoding="utf-8")
    return markdown.markdown(
        raw_text,
        extensions=["extra", "sane_lists", "smarty"],
    )


def _load_posts(locale: str) -> list[BlogPost]:
    with POSTS_PATH.open("r", encoding="utf-8") as file:
        raw_posts = json.load(file)

    locale_key = _resolve_locale(locale)
    default_locale = "zh"
    return [
        BlogPost(
            locale=locale_key,
            slug=str(item["slug"]),
            title=str((item.get("translations", {}).get(locale_key) or item.get("translations", {}).get(default_locale))["title"]),
            summary=str((item.get("translations", {}).get(locale_key) or item.get("translations", {}).get(default_locale))["summary"]),
            published_at=str(item["published_at"]),
            reading_time=str(item.get("reading_time", "")),
            featured=bool(item.get("featured", False)),
            tags=[str(tag) for tag in item.get("tags", [])],
            body_html=_render_markdown(
                str((item.get("translations", {}).get(locale_key) or item.get("translations", {}).get(default_locale))["body_file"])
            ),
        )
        for item in raw_posts
    ]


@lru_cache()
def get_blog_site(locale: str = "zh") -> BlogSite:
    return _load_site(locale)


@lru_cache()
def get_blog_posts(locale: str = "zh") -> list[BlogPost]:
    return _load_posts(locale)


def get_blog_post(slug: str, locale: str = "zh") -> BlogPost | None:
    for post in get_blog_posts(locale):
        if post.slug == slug:
            return post
    return None


def get_featured_posts(locale: str = "zh") -> list[BlogPost]:
    return [post for post in get_blog_posts(locale) if post.featured]
