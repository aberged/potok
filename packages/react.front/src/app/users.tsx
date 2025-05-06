import { useFindManyUser } from "../zenstack/tanstack/hooks";

export function Users() {
  const { isLoading, data: users, error } = useFindManyUser({
    include: { memberOf: true },
    orderBy: { createdAt: 'desc' }, 
  });

  return (
    <div>
      <h1>Users</h1>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      <ul>
        {users?.map((user) => (
          <li key={user.id}>
            {user.name} - {user.email}
            <ul>
              {user.memberOf.map((group) => (
                <li key={group.id}>{group.name}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}