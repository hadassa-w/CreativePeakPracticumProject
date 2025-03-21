using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CreativePeak.Data.Migrations
{
    /// <inheritdoc />
    public partial class onetomanyinViewDB1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_View_Images_ImageId",
                table: "View");

            migrationBuilder.DropForeignKey(
                name: "FK_View_Users_UserId",
                table: "View");

            migrationBuilder.DropPrimaryKey(
                name: "PK_View",
                table: "View");

            migrationBuilder.RenameTable(
                name: "View",
                newName: "Views");

            migrationBuilder.RenameIndex(
                name: "IX_View_UserId",
                table: "Views",
                newName: "IX_Views_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_View_ImageId",
                table: "Views",
                newName: "IX_Views_ImageId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Views",
                table: "Views",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Views_Images_ImageId",
                table: "Views",
                column: "ImageId",
                principalTable: "Images",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Views_Users_UserId",
                table: "Views",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Views_Images_ImageId",
                table: "Views");

            migrationBuilder.DropForeignKey(
                name: "FK_Views_Users_UserId",
                table: "Views");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Views",
                table: "Views");

            migrationBuilder.RenameTable(
                name: "Views",
                newName: "View");

            migrationBuilder.RenameIndex(
                name: "IX_Views_UserId",
                table: "View",
                newName: "IX_View_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_Views_ImageId",
                table: "View",
                newName: "IX_View_ImageId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_View",
                table: "View",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_View_Images_ImageId",
                table: "View",
                column: "ImageId",
                principalTable: "Images",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_View_Users_UserId",
                table: "View",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
