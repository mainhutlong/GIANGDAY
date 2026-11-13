using System;
using System.Diagnostics;
using System.IO;
using System.Net;
using System.Net.Sockets;
using System.Threading;
using System.Windows.Forms;

namespace GiangDayCNTT
{
    static class Program
    {
        private static Process nodeProcess = null;

        [STAThread]
        static void Main(string[] args)
        {
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);

            string baseDir = AppDomain.CurrentDomain.BaseDirectory;

            // 1. Tìm tệp thực thi node.exe
            string nodePath = FindNodeExecutable(baseDir);
            if (string.IsNullOrEmpty(nodePath) || !File.Exists(nodePath))
            {
                MessageBox.Show(
                    "Không tìm thấy môi trường thực thi runtime/node.exe.\n\n" +
                    "Vui lòng đảm bảo bạn đã giải nén đầy đủ thư mục ứng dụng bao gồm thư mục 'runtime'.",
                    "Hệ thống Đào tạo CNTT - Lỗi Khởi Động",
                    MessageBoxButtons.OK,
                    MessageBoxIcon.Error
                );
                return;
            }

            // 2. Tìm tệp server.cjs
            string serverScript = Path.Combine(baseDir, "server.cjs");
            if (!File.Exists(serverScript))
            {
                MessageBox.Show(
                    "Không tìm thấy tệp mã nguồn server.cjs trong thư mục ứng dụng.\n\n" +
                    "Vui lòng kiểm tra lại thư mục cài đặt.",
                    "Hệ thống Đào tạo CNTT - Lỗi",
                    MessageBoxButtons.OK,
                    MessageBoxIcon.Error
                );
                return;
            }

            // 3. Chọn một cổng TCP khả dụng
            int port = GetAvailablePort(3899);

            // 4. Khởi động Node.js server dưới nền (hoàn toàn ẩn cửa sổ console)
            try
            {
                ProcessStartInfo psi = new ProcessStartInfo();
                psi.FileName = nodePath;
                psi.Arguments = string.Format("\"{0}\" {1}", serverScript, port);
                psi.WorkingDirectory = baseDir;
                psi.CreateNoWindow = true;
                psi.UseShellExecute = false;
                psi.WindowStyle = ProcessWindowStyle.Hidden;

                nodeProcess = Process.Start(psi);
            }
            catch (Exception ex)
            {
                MessageBox.Show(
                    "Không thể khởi động máy chủ cục bộ: " + ex.Message,
                    "Lỗi",
                    MessageBoxButtons.OK,
                    MessageBoxIcon.Error
                );
                return;
            }

            // Đăng ký dọn dẹp tiến trình Node khi ứng dụng thoát
            AppDomain.CurrentDomain.ProcessExit += (s, e) => Cleanup();

            // 5. Đợi một lát để server lắng nghe
            Thread.Sleep(1200);

            string appUrl = string.Format("http://localhost:{0}/", port);

            // 6. Tìm Microsoft Edge để chạy ở chế độ App Window (như một phần mềm desktop độc lập)
            string edgePath = FindEdgeExecutable();
            if (!string.IsNullOrEmpty(edgePath) && File.Exists(edgePath))
            {
                try
                {
                    string profileDir = Path.Combine(Path.GetTempPath(), "GiangDayCNTT_Profile");
                    string edgeArgs = string.Format("--app=\"{0}\" --user-data-dir=\"{1}\" --window-size=1366,850", appUrl, profileDir);

                    ProcessStartInfo edgePsi = new ProcessStartInfo();
                    edgePsi.FileName = edgePath;
                    edgePsi.Arguments = edgeArgs;
                    edgePsi.UseShellExecute = false;

                    Process edgeProc = Process.Start(edgePsi);
                    if (edgeProc != null)
                    {
                        // Đợi cho đến khi người dùng đóng cửa sổ ứng dụng
                        edgeProc.WaitForExit();
                    }
                }
                catch
                {
                    // Dự phòng nếu không mở được Edge
                    OpenInDefaultBrowser(appUrl);
                }
            }
            else
            {
                // Nếu máy tính không có Microsoft Edge, mở trên trình duyệt mặc định
                OpenInDefaultBrowser(appUrl);
            }

            // Dọn dẹp tiến trình node khi kết thúc
            Cleanup();
        }

        private static string FindNodeExecutable(string baseDir)
        {
            // Ưu tiên 1: runtime/node.exe (Portable đóng gói đi kèm)
            string p1 = Path.Combine(baseDir, "runtime", "node.exe");
            if (File.Exists(p1)) return p1;

            // Ưu tiên 2: bin/node.exe
            string p2 = Path.Combine(baseDir, "bin", "node.exe");
            if (File.Exists(p2)) return p2;

            // Ưu tiên 3: node.exe ngay thư mục gốc
            string p3 = Path.Combine(baseDir, "node.exe");
            if (File.Exists(p3)) return p3;

            // Ưu tiên 4: Node.js cài sẵn trên hệ thống Windows
            string p4 = @"C:\Program Files\nodejs\node.exe";
            if (File.Exists(p4)) return p4;

            string p5 = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86), @"nodejs\node.exe");
            if (File.Exists(p5)) return p5;

            return null;
        }

        private static string FindEdgeExecutable()
        {
            string[] candidatePaths = new string[]
            {
                @"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
                @"C:\Program Files\Microsoft\Edge\Application\msedge.exe",
                Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), @"Microsoft\Edge\Application\msedge.exe")
            };

            foreach (string p in candidatePaths)
            {
                if (File.Exists(p)) return p;
            }
            return null;
        }

        private static int GetAvailablePort(int startingPort)
        {
            for (int p = startingPort; p < startingPort + 50; p++)
            {
                try
                {
                    TcpListener listener = new TcpListener(IPAddress.Loopback, p);
                    listener.Start();
                    listener.Stop();
                    return p;
                }
                catch { }
            }
            return 3899;
        }

        private static void OpenInDefaultBrowser(string url)
        {
            try
            {
                Process.Start(new ProcessStartInfo(url) { UseShellExecute = true });
                // Hiển thị thông báo nhỏ để người dùng có thể tắt server khi dùng xong
                MessageBox.Show(
                    "Hệ thống Đào tạo CNTT đang hoạt động tại:\n" + url +
                    "\n\nNhấn OK khi bạn muốn kết thúc phiên làm việc.",
                    "Hệ thống Đào tạo CNTT",
                    MessageBoxButtons.OK,
                    MessageBoxIcon.Information
                );
            }
            catch (Exception ex)
            {
                MessageBox.Show("Lỗi mở trình duyệt: " + ex.Message);
            }
        }

        private static void Cleanup()
        {
            try
            {
                if (nodeProcess != null && !nodeProcess.HasExited)
                {
                    nodeProcess.Kill();
                    nodeProcess.Dispose();
                    nodeProcess = null;
                }
            }
            catch { }
        }
    }
}

