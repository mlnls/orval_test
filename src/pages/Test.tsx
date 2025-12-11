import { useQueryClient } from "@tanstack/react-query";
import {
  useGetApiUsers,
  useGetApiUsersId,
  usePostApiUsers,
  usePutApiUsersId,
  useDeleteApiUsersId,
  getGetApiUsersQueryKey,
  getGetApiUsersIdQueryKey,
} from "../api/generated/users/users";
import { useState } from "react";

export const TestPage = () => {
  const queryClient = useQueryClient();
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  // 사용자 목록 조회
  const { data: users, isLoading } = useGetApiUsers();

  // 특정 사용자 조회
  const { data: user } = useGetApiUsersId(selectedUserId ?? 0, {
    query: {
      enabled: selectedUserId !== null,
    },
  });

  // 사용자 생성
  const createUserMutation = usePostApiUsers({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetApiUsersQueryKey() });
      },
    },
  });

  // 사용자 수정
  const updateUserMutation = usePutApiUsersId({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetApiUsersQueryKey() });
        if (selectedUserId !== null) {
          queryClient.invalidateQueries({
            queryKey: getGetApiUsersIdQueryKey(selectedUserId),
          });
        }
      },
    },
  });

  // 사용자 삭제
  const deleteUserMutation = useDeleteApiUsersId({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetApiUsersQueryKey() });
        setSelectedUserId(null);
      },
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        로딩 중...
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">API 테스트 (Orval 연동)</h1>

      <div className="grid grid-cols-2 gap-6">
        {/* 사용자 목록 */}
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">사용자 목록</h2>
          <div className="space-y-2">
            {users?.map((user) => (
              <div
                key={user.id}
                className={`p-3 border rounded cursor-pointer hover:bg-gray-50 ${
                  selectedUserId === user.id ? "bg-blue-100" : ""
                }`}
                onClick={() => setSelectedUserId(user.id!)}
              >
                <div className="font-medium">{user.name}</div>
                <div className="text-sm text-gray-600">{user.email}</div>
                {user.age && (
                  <div className="text-sm text-gray-500">나이: {user.age}</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 선택된 사용자 상세 */}
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">사용자 상세</h2>
          {user ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">이름</label>
                <input
                  type="text"
                  defaultValue={user.name}
                  className="w-full border rounded px-3 py-2"
                  onBlur={(e) => {
                    if (e.target.value !== user.name && selectedUserId) {
                      updateUserMutation.mutate({
                        id: selectedUserId,
                        data: { name: e.target.value },
                      });
                    }
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">이메일</label>
                <input
                  type="email"
                  defaultValue={user.email}
                  className="w-full border rounded px-3 py-2"
                  onBlur={(e) => {
                    if (e.target.value !== user.email && selectedUserId) {
                      updateUserMutation.mutate({
                        id: selectedUserId,
                        data: { email: e.target.value },
                      });
                    }
                  }}
                />
              </div>
              <button
                onClick={() => {
                  if (selectedUserId) {
                    deleteUserMutation.mutate({ id: selectedUserId });
                  }
                }}
                className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
              >
                삭제
              </button>
            </div>
          ) : (
            <p className="text-gray-500">사용자를 선택하세요</p>
          )}
        </div>
      </div>

      {/* 새 사용자 추가 */}
      <div className="mt-6 border rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-4">새 사용자 추가</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target as HTMLFormElement);
            createUserMutation.mutate({
              data: {
                name: formData.get("name") as string,
                email: formData.get("email") as string,
                age: formData.get("age")
                  ? parseInt(formData.get("age") as string)
                  : undefined,
              },
            });
            (e.target as HTMLFormElement).reset();
          }}
          className="flex gap-4"
        >
          <input
            type="text"
            name="name"
            placeholder="이름"
            required
            className="border rounded px-3 py-2 flex-1"
          />
          <input
            type="email"
            name="email"
            placeholder="이메일"
            required
            className="border rounded px-3 py-2 flex-1"
          />
          <input
            type="number"
            name="age"
            placeholder="나이 (선택)"
            className="border rounded px-3 py-2 w-24"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            추가
          </button>
        </form>
      </div>
    </div>
  );
};
