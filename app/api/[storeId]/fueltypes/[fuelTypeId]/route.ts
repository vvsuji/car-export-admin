import { NextResponse } from 'next/server';

import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs';

export async function GET(
	req: Request,
	{ params }: { params: { fuelTypeId: string } },
) {
	try {
		if (!params.fuelTypeId) {
			return new NextResponse('Fuel type id is required', { status: 400 });
		}

		const fuelType = await prismadb.fuelType.findUnique({
			where: {
				id: params.fuelTypeId,
			},
		});

		return NextResponse.json(fuelType);
	} catch (error) {
		console.log('[_GET]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}

export async function DELETE(
	req: Request,
	{ params }: { params: { fuelTypeId: string; storeId: string } },
) {
	try {
		const { userId } = auth();

		if (!userId) {
			return new NextResponse('Unauthenticated', { status: 403 });
		}

		if (!params.fuelTypeId) {
			return new NextResponse('Fuel type id is required', { status: 400 });
		}

		const storeByUserId = await prismadb.store.findFirst({
			where: {
				id: params.storeId,
				userId,
			},
		});

		if (!storeByUserId) {
			return new NextResponse('Unauthorized', { status: 405 });
		}

		const fuelType = await prismadb.fuelType.delete({
			where: {
				id: params.fuelTypeId,
			},
		});

		return NextResponse.json(fuelType);
	} catch (error) {
		console.log('[FUELTYPE_DELETE]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}

export async function PATCH(
	req: Request,
	{ params }: { params: { fuelTypeId: string; storeId: string } },
) {
	try {
		const { userId } = auth();

		const body = await req.json();

		const { name } = body;

		if (!userId) {
			return new NextResponse('Unauthenticated', { status: 403 });
		}

		if (!name) {
			return new NextResponse('Name is required', { status: 400 });
		}

		// if (!value) {
		// 	return new NextResponse('Value is required', { status: 400 });
		// }

		if (!params.fuelTypeId) {
			return new NextResponse('Fuel type id is required', { status: 400 });
		}

		const storeByUserId = await prismadb.store.findFirst({
			where: {
				id: params.storeId,
				userId,
			},
		});

		if (!storeByUserId) {
			return new NextResponse('Unauthorized', { status: 405 });
		}

		const fuelType = await prismadb.fuelType.update({
			where: {
				id: params.fuelTypeId,
			},
			data: {
				name,
			},
		});

		return NextResponse.json(fuelType);
	} catch (error) {
		console.log('[FUELTYPE_PATCH]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}
