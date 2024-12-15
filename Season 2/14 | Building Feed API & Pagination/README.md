<h1 style="text-align: center; display: flex; justify-content: space-between;">
  🚀 <span>Namaste Node.js - 14 | Building Feed API & Pagination</span> 🚀
</h1>

## Table of Contents

- [Table of Contents](#table-of-contents)
- [What is Pagination?](#what-is-pagination)
- [Why is Pagination Needed?](#why-is-pagination-needed)
- [Implementing Pagination with Skip and Limit in Mongoose](#implementing-pagination-with-skip-and-limit-in-mongoose)
  - [Example of Pagination Using Skip and Limit](#example-of-pagination-using-skip-and-limit)
- [Conclusion](#conclusion)

## What is Pagination?

Pagination is the process of dividing a large set of data into smaller chunks or pages, making it easier to manage and display in user interfaces. Instead of loading all the records at once, which can cause performance issues, we load a small number of records per request, and users can navigate between different pages of data.

## Why is Pagination Needed?

Pagination is crucial for improving performance and providing a better user experience, especially when dealing with large amounts of data. Here are some reasons why pagination is important:

- **Faster Loading:** Loading a large dataset in one go can slow down your application and create performance bottlenecks. Pagination helps reduce the initial load time.
- **Improved User Experience:** It allows users to navigate through the data in a controlled manner, typically through "next" and "previous" buttons.
- **Efficient Database Queries:** Pagination reduces the load on the database by limiting the number of records returned in each query, making data retrieval faster and more efficient.

## Implementing Pagination with Skip and Limit in Mongoose

Mongoose provides two powerful operators to help implement pagination:

- **`skip()`**: Skips a specified number of documents.
- **`limit()`**: Limits the number of documents returned.

### Example of Pagination Using Skip and Limit

Here’s an example of how to implement pagination in a Feed API:

```javascript
// Route for paginated feed posts
userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const user = req.user;

    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: user._id }, { toUserId: user._id }],
    }).select("fromUserId toUserId");

    //! to get a set of all the user whom user have send/received request including himself
    const hideUserProfile = new Set();

    //! Hiding logged user
    hideUserProfile.add(user._id.toString());

    //! Hiding user requests
    connectionRequests.forEach((request) => {
      hideUserProfile.add(request.fromUserId.toString());
      hideUserProfile.add(request.toUserId.toString());
    });

    //! finding limited the user profile that are not in hideUserProfile
    const page =
      parseInt(req.query.page) < 1 ? 1 : parseInt(req.query.page) || 1;
    let limit =
      parseInt(req.query.limit) > 50
        ? 50
        : parseInt(req.query.limit) < 1
        ? 1
        : parseInt(req.query.limit) || 10;

    const userProfiles = await User.find({
      _id: { $nin: Array.from(hideUserProfile) },
      status: "active",
    })
      .select([
        "firstName",
        "lastName",
        "username",
        "avatar",
        "about",
        "skills",
        "gender",
        "status",
      ])
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({ message: userProfiles });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
```

In this example, the `skip` and `limit` methods are used with `select` to retrieve a specific page of results with specific data from the MongoDB collection. The `page` query parameter determines which page of results to fetch, and `pageSize` defines how many results to show per page.

## Conclusion

Pagination is an essential technique for handling large datasets, improving application performance, and providing a better user experience. By using Mongoose's skip and limit methods, we can easily implement pagination in our Node.js applications. This simple and efficient method helps ensure that our applications remain fast and responsive, even when dealing with large volumes of data.

If you found this summary helpful, **please ⭐ star the repository** to show your support! 😊
