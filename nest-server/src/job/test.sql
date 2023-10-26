select "job"."id" as "job_id",
    "job"."user_id",
    "user"."username",
    "job"."title",
    "job"."description",
    "job"."price",
    "job"."type",
    "job"."created_at",
    "job"."cancel_time",
    count(bookmark.user_id) as has_bookmark
from "bookmark"
    inner join "job" on "job"."id" = "bookmark"."job_id"
    inner join "user" on "user"."id" = "bookmark"."user_id"
where "bookmark"."user_id" = $1
    and
    and "job"."cancel_time" is null
group by "job"."id",
    "user"."id"
order by max(bookmark.id) desc,
    "job"."id" desc