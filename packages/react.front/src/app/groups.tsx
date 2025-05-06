import { useFindManyGroup } from "../zenstack/tanstack/hooks";

export function Groups() {
  const { isLoading, data: groups, error } = useFindManyGroup({
    include: { members: true, creator: true },
    orderBy: { createdAt: 'desc' }, 
  });

  return (
    <div>
      <h1>Groups</h1>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      <ul>
        {groups?.map((group) => (
          <li key={group.id}>
            {group.name} - created by {group.creator.name}
            <ul>
              {group.members.map((member) => (
                <li key={member.id}>{member.name} - {member.email}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}